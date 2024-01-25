import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "node:path";

// cwd <string> 子进程的当前工作目录。
// env <Object> 环境变量键值对。
// encoding <string> 默认为 'utf8'。
// shell <string> 用于执行命令的 shell。 在 UNIX 上默认为 '/bin/sh'，在 Windows 上默认为 process.env.ComSpec。 详见 Shell Requirements 与 Default Windows Shell。
// timeout <number> 默认为 0。
// maxBuffer <number> stdout 或 stderr 允许的最大字节数。 默认为 200*1024。 如果超过限制，则子进程会被终止。 查看警告： maxBuffer and Unicode。
// killSignal <string> | <integer> 默认为 'SIGTERM'。
// uid <number> 设置该进程的用户标识。（详见 setuid(2)）
// gid <number> 设置该进程的组标识。（详见 setgid(2)）

try {
  const args = process.argv.slice(2);
  const result = args.length > 0 ? args.join(" ") : "";
  execSync("npm run build", { stdio: "inherit" });
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const distPath = path.resolve(__dirname, "../dist");
  let command = `npm publish --access public ${result}`;
  execSync(command, {
    stdio: "inherit",
    cwd: distPath,
  });
  console.log(`Published  Sucess`);
} catch (error) {
  // 命令执行失败，可以处理错误信息
  console.error("命令执行失败:", error);
}
