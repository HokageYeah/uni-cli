import inquirer from "inquirer";
import { askObjType, isGitlab } from "../types/askTypes";
import { getRepolist, httpDownloadTemp } from "./requestHttp";
// 引入ora工具：命令行loading 动效
import ora from "ora";
import path from "node:path";
import fs from "node:fs";

// 创建项目模板类
export class GeneratorTemplate {
  name: string;
  target: string;
  ask: askObjType;

  // name 项目名称
  // target 创建项目的路径
  // 用户输入的 作者和项目描述 信息
  constructor(name: string, target: string, ask: askObjType) {
    this.name = name;
    this.target = target;
    this.ask = ask;
  }
  async getRepos() {
    // 获取git仓库的项目列表
    const spinner = ora("获取git仓库的项目列表中...");
    spinner.start();
    try {
      let repolist = await getRepolist();
      if (!repolist){
        spinner.fail("获取git仓库的项目列表失败❎, 列表为空");
        return null;
      };
      if(repolist instanceof Object && (repolist.hasOwnProperty('error') || repolist.hasOwnProperty('message'))){
        const error: any = repolist.error;
        const error_description: string = repolist.error_description;
        const message: string = repolist.message;
        spinner.fail(`获取git仓库的项目列表失败❎, 错误类型: ${error} 错误描述: ${error_description} 错误信息: ${message}`);
        return null;
      }
      // 如果是gitlab 则过滤出只有uni开头的项目
      if(isGitlab) {
        spinner.succeed(`获取gitLab仓库的项目列表成功✅ ${repolist.length}个项目`);
        repolist = repolist.filter((item: any) => item.name.startsWith("uni"));
        spinner.succeed(`过滤以uni开头的项目列表成功✅ ${repolist.length}个项目`);
        spinner.succeed(`gitLab仓库的uni开头项目列表：\n${repolist.map((item: any) => item.name).join("\n")}`);
      }else{
        spinner.succeed(`获取git仓库的项目列表成功✅ ${repolist.length}个项目`);
        spinner.succeed(`git仓库的项目列表：\n${repolist.map((item: any) => item.name).join("\n")}`);
      }
      return repolist.map((item: any) => item.name);
    } catch (error: any) {
      spinner.fail(`获取git仓库的项目列表失败❎${error}`);
    }
  }
  async getChoiceRepo(repos: []) {
    const { repo } = await inquirer.prompt({
      name: "repo",
      type: "list",
      message: "请选择一个模板",
      choices: repos,
    });
    return repo;
  }
  async downLoadTemplate(repo: string) {
    const requestUrl = isGitlab
      ? `direct:https://gitlab.xxt.cn/frontend/uni-app/${repo}.git/#master`
      : `github:HokageYeah/${repo}#master`;
    const spinner = ora("模板工程下载中...");
    spinner.start();
    try {
      await httpDownloadTemp(requestUrl, this.target);
      spinner.succeed(`模板${repo}下载完成✅`);
    } catch (error) {
      spinner.fail(`模板下载失败❎${error}`);
    }
  }
  async create() {
    // 获取git仓库的项目列表
    const repos = await this.getRepos();
    if (!repos) return;
    // 获取用户git仓库的选择列表
    const choiceRepo = await this.getChoiceRepo(repos);
    if (!choiceRepo) return;
    // 下载选择的项目模板
    await this.downLoadTemplate(choiceRepo);
    // 下载完成后获取项目的package.json文件更改，作者和描述
    const packageJsonPath = path.join(this.target, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const packageJsonBuf = fs.readFileSync(packageJsonPath);
      const packageJson = JSON.parse(packageJsonBuf.toString());
      packageJson.name = this.name;
      // 让用户输入的内容 替换到 package.json中对应的字段
      Object.entries(this.ask).forEach(([key, value]) => {
        // 如果version没有值，则给个默认的
        if (!value && key === "version") value = "1.0.0";
        packageJson[key] = value;
      });
      // 修改原来的package.json文件
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        "utf-8"
      );
    }
  }
}
