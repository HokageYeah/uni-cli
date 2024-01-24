import path from "node:path";
import fs from "node:fs";
import inquirer from "inquirer";
import { askObj } from "./ask";
import { askObjType } from "../types/askTypes";
import { GeneratorTemplate } from "./generatorTemplate";

const askInquirer = (name: string, targetDir: string) => {
  inquirer.prompt(askObj).then((askObj: askObjType) => {
    // 创建项目class
    const generatorTemplate = new GeneratorTemplate(name, targetDir, askObj);
    generatorTemplate.create();
  });
  // console.log("createProject", name, options, targetDir);
};

export const createProject = (name: string, options: any) => {
  // process.cwd获取当前的工作目录 esmodule不能使用__dirname
  const cwd = process.cwd();
  // path.join拼接 要创建项目的目录
  const targetDir = path.join(cwd, name);
  // 判断该目录是否存在 且options的force有则强制删除
  if (fs.existsSync(targetDir)) {
    // 强制同步删除
    if (options.force) {
      fs.rmSync(targetDir, { recursive: true });
      askInquirer(name, targetDir)
    } else {
      // 通过inquirer：询问用户是否确定要覆盖 or 取消
      inquirer
        .prompt([
          {
            name: "action",
            type: "list",
            message: "目录下项目已经存在，是否覆盖?",
            choices: [
              {
                name: "覆盖",
                value: "overwrite",
              },
              {
                name: "取消",
                value: false,
              },
            ],
          },
        ])
        .then(({ action }) => {
          if (!action) return;
          fs.rmSync(targetDir, { recursive: true });
          askInquirer(name, targetDir)
        });
    }
  }else{
    askInquirer(name, targetDir)
  }
};
