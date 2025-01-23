import fs from "fs";
import { setPathName } from "./requestHttp";
import ora from "ora";

const gitlabName = (isGitlab: boolean) => {
    return isGitlab ? "gitlab" : "github";
}

export const setToken = (isGitlab: boolean, token: string, options: any) => {
    const spinner = ora(`设置${gitlabName(isGitlab)}token中...`);
    spinner.start();
    const tokenJsonPath = setPathName("../virtualTkn/virtualTkn.json");
    const tokenJson = fs.readFileSync(tokenJsonPath, "utf-8");
    const tokenJsonObj = JSON.parse(tokenJson);
    tokenJsonObj[isGitlab ? "gitLabToken" : "gitHubToken"] = token;
    fs.writeFileSync(tokenJsonPath, JSON.stringify(tokenJsonObj, null, 4));
    spinner.succeed(`设置${gitlabName(isGitlab)}token成功, ${gitlabName(isGitlab)}token: ${token}`);
}

export const getToken = (isGitlab: boolean) => {
    const spinner = ora("获取token中...");
    spinner.start();
    const tokenJsonPath = setPathName("../virtualTkn/virtualTkn.json");
    const tokenJson = fs.readFileSync(tokenJsonPath, "utf-8");
    const tokenJsonObj = JSON.parse(tokenJson);
    // 输出控制台上展示结果
    spinner.succeed(`获取${gitlabName(isGitlab)}token成功, ${gitlabName(isGitlab)}token: ${isGitlab ? tokenJsonObj.gitLabToken : tokenJsonObj.gitHubToken}`);
}

export const setIsGitlab = (isGitlab: string, options: any) => {
    const spinner = ora("设置isgitlab中...");
    spinner.start();
    if (isGitlab !== "true" && isGitlab !== "false") {
        spinner.fail("isGitlab参数错误，请输入true或false");
        return;
    }
    const tokenJsonPath = setPathName("../virtualTkn/virtualTkn.json");
    const tokenJson = fs.readFileSync(tokenJsonPath, "utf-8");
    const tokenJsonObj = JSON.parse(tokenJson);
    // isGitlab 是字符串类型，需要转换为布尔类型
    tokenJsonObj.isGitlab = isGitlab === "true";
    fs.writeFileSync(tokenJsonPath, JSON.stringify(tokenJsonObj, null, 4));
    spinner.succeed(`设置isgitlab成功, isgitlab: ${isGitlab}`);
}

export const getIsGitlab = () => {
    const tokenJsonPath = setPathName("../virtualTkn/virtualTkn.json");
    const tokenJson = fs.readFileSync(tokenJsonPath, "utf-8");
    const tokenJsonObj = JSON.parse(tokenJson);
    const spinner = ora("获取isgitlab中...");   
    spinner.start();
    spinner.succeed(`获取isgitlab成功, isgitlab: ${tokenJsonObj.isGitlab}`);
}