import { askObjType } from "../types/askTypes";

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
  create() {
    console.log("项目创建调用了");
  }
}
