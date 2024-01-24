import downloadGitRepo from "download-git-repo";

const isGitlab = true;
const gitToken = "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";
const gitLabToken = "glpat-zxzDgfjb1pM1RWxXJLwD";

// GitHub api接口请求次数限制破解: https://www.jianshu.com/p/b567ea7f1d28
export const getRepolist = () => {
  const url = isGitlab
    ? `https://gitlab.xxt.cn/api/v4/groups/1683/projects?private_token=${gitLabToken}`
    : "https://api.github.com/users/HokageYeah/repos?per_page=60";
  return fetch(url, {
    headers: {
      Authorization: `token${isGitlab ? "" : gitToken}`,
    },
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const httpDownloadTemp = (requestUrl: string, target: string) => {
  return new Promise<void>((resolve, reject) => {
    downloadGitRepo(
      `${requestUrl}`,
      target,
      {
        clone: true,
        headers: {
          private_token: gitLabToken,
          Authorization: `Bearer ${gitLabToken}`,
        },
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
