import path from "path";
import { isGitlab } from "../types/askTypes";
import downloadGitRepo from "download-git-repo";
import yeahUrl from "node:url";
import fs from "fs";

// GitHub api接口请求次数限制破解: https://www.jianshu.com/p/b567ea7f1d28
export const getRepolist = () => {
  // 在type为module 下  __dirname 为 __dirname is not defined 为commonjs的规范
  const tokenJsonPath = setPathName("../virtualTkn/virtualTkn.json");
  // 读取virtualTkn.json文件(同步读取)
  const tokenJson = fs.readFileSync(tokenJsonPath, "utf-8");
  const tokenJsonObj = JSON.parse(tokenJson);
  const gitLabToken = tokenJsonObj.gitLabToken;
  const gitHubToken = tokenJsonObj.gitHubToken;
  const isGitlab = tokenJsonObj.isGitlab;
  const url = isGitlab
    ? `https://gitlab.xxt.cn/api/v4/groups/1683/projects?private_token=${gitLabToken}&per_page=100`
    : "https://api.github.com/users/HokageYeah/repos?per_page=60";
  return fetch(url, {
    headers: {
      Authorization: `token${isGitlab ? "" : gitHubToken}`,
    },
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const setPathName = (pathName: string) => {
  const url = import.meta.url;
  const __dirname = path.dirname(yeahUrl.fileURLToPath(url));
  const crossPlatformPath = path.resolve(__dirname, pathName);
  return crossPlatformPath;
}

export const httpDownloadTemp = (requestUrl: string, target: string) => {
  return new Promise<void>((resolve, reject) => {
    downloadGitRepo(
      `${requestUrl}`,
      target,
      {
        clone: true,
        // headers: {
        //   private_token: gitLabToken,
        //   Authorization: `Bearer ${gitLabToken}`,
        // },
        timeout: 10000, 
        checkout: 'master',
        depth: 1,
      },
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

// 引入axios
// import axios from 'axios';
// axios.interceptors.response.use((res) => {
//   return res.data;
// });

// // 获取git上的项目列表
// export const getRepolist = () => {
//   return axios.get('https://api.github.com/orgs/ant-design/repos');
// }
