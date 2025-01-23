declare module 'download-git-repo' {
    function download(
      repository: string,
      destination: string,
      options: Record<string, any>,
      callback: (err?: Error) => void
    ): void;
    export = download;  // 修改这里，使用 export = 而不是 export default
  }