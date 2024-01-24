import inquirer from "inquirer";
import { askObjType } from "../types/askTypes";
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
  isGitlab = true;

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
      const repolist = await getRepolist();
      spinner.succeed("获取git仓库的项目列表成功✅");
      // console.log('git仓库列表：', repolist);
      if (!repolist) return;
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
    const requestUrl = this.isGitlab
      ? `frontend/uni-app/${repo}`
      : `HokageYeah/${repo}`;
    console.log("下载地址：", requestUrl);
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
    // 获取用户git仓库的选择列表
    const choiceRepo = await this.getChoiceRepo(repos);
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
