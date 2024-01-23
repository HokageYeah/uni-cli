import { defineConfig } from "tsup";
import copyfiles from "copyfiles";

/*
entry

类型：string 或 string[]
入口文件路径。可以是单个文件路径或多个文件路径组成的数组。
target

类型：string 或 string[]
目标环境的代码输出格式。支持的值包括：
'node'：Node.js 环境（默认）
'browser'：浏览器环境
'es20XX'：ES 标准版本，如 'es2020'、'es2021'，等等。
可以是单个字符串或多个字符串组成的数组，用于同时生成多份目标格式的代码。
splitting

类型：boolean
是否启用代码拆分（默认为 false）。启用后，tsup 将根据导入关系自动创建多个输出文件，以实现更好的代码分割和按需加载。
format

类型：string
输出的模块格式。支持的值包括：
'cjs'：CommonJS 格式（默认）
'esm'：ES 模块格式
'iife'：立即执行函数格式
'umd'：通用模块定义格式
可根据项目需求选择合适的模块格式。
minify

类型：boolean
是否启用代码压缩（默认为 false）。启用后，tsup 将会使用 terser 对输出的代码进行压缩。
dts

类型：boolean
是否生成类型声明文件（默认为 true）。如果你的 TypeScript 项目中没有使用类型声明，可以将其设置为 false。
clean

类型：boolean
在打包之前是否清空输出目录（默认为 true）。如果你希望保留之前的构建结果，可以将其设置为 false。


sourcemap 是一个用于控制生成 Source Map 的选项。

配置项的可能取值为：

true：生成完整的 Source Map 文件。
false：不生成 Source Map 文件。
'inline'：将 Source Map 作为 Data URI 内联到生成的文件中。
'hidden'：生成 Source Map 文件，但不在输出的代码中引用它。这在生产环境中常见，以避免向客户端泄露源代码结构。
*/

// 配置插件 复制文件插件
const copyFilesPlugin = {
  name: "copy-files-plugin",
  setup: () => {
    copyfiles(["src/data/*.json", "dist"], { up: 1 }, (err) => {
      if (err) {
        console.error("复制文件时发生错误:", err);
      } else {
        console.log("文件复制完成。");
      }
    });
  },
};

export default defineConfig({
  target: "node12", //目标环境的代码输出格式
  entryPoints: ["src/index.ts"], // 根据实际情况修改入口文件路径
  // format: ["cjs","esm"], //输出的模块格式。
  format: ["esm"], //输出的模块格式。
  dts: true, //是否生成类型声明文件（默认为 true）。如果你的 TypeScript 项目中没有使用类型声明，可以将其设置为 false。
  sourcemap: true, //生成完整的 Source Map 文件
  splitting: true, //是否启用代码拆分（默认为 false）。启用后，tsup 将根据导入关系自动创建多个输出文件，以实现更好的代码分割和按需加载。
  clean: true, //在打包之前是否清空输出目录（默认为 true）。如果你希望保留之前的构建结果，可以将其设置为 false
  minify: true, //是否启用代码压缩（默认为 false）。启用后，tsup 将会使用 terser 对输出的代码进行压缩。
  legacyOutput: true, //true：采用传统的输出目录结构。每个源文件将产生一个对应的输出文件。
});
