#!/usr/bin/env node
// 告诉操作系统执行自定义命令的时候 帮我用node去执行这个文件

import { program } from "commander";
import fs from 'node:fs';
import { createProject } from './code/create';
import {packageJsonPath} from '../scripts/build'
let jsonBuf = fs.readFileSync(packageJsonPath);
let json = JSON.parse(jsonBuf.toString());

// 脚手架版本号
program.version(json.version, '-v, --version', 'output the uni-cli version')
// console.log('hellow uni-cli---------');


program
    // 创建create 命令，用户可以通过 uni0cli creat appName 来创建项目
    .command('create <app-name>')
    // 简写
    .alias('c')
    // create命令的选项
    .option('-f, --force', 'overwrite target directory if it exist')
    // 命名的描述
    .description('create a new uni-project')
    // 处理函数
    .action((name, options) => {
        createProject(name, options)
    })


// 解析命令行参数
program.parse(process.argv);