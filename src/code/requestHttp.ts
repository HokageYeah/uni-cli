import downloadGitRepo from "download-git-repo";

// GitHub api接口请求次数限制破解: https://www.jianshu.com/p/b567ea7f1d28
export const getRepolist = () => {
  const gitToken = "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";
  return fetch("https://api.github.com/users/HokageYeah/repos?per_page=60", {
    headers: {
      Authorization: `token${gitToken}`,
    },
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const httpDownloadTemp = (requestUrl: string, target: string) => {
  return new Promise<void>((resolve, reject) => {
    downloadGitRepo(
      requestUrl,
      target,
      { clone: true },
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
