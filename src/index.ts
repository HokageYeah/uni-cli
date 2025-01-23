#!/usr/bin/env node
// 告诉操作系统执行自定义命令的时候 帮我用node去执行这个文件

import { program } from "commander";
import fs from 'node:fs';
import { createProject } from './code/create';
import {packageJsonPath} from '../scripts/build'
import { setToken, getToken, setIsGitlab, getIsGitlab } from './code/handleToken';
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
program
    .command('setlabtoken <token>')
    .alias('slt')
    .option('-f, --force', 'overwrite target directory if it exist')
    .description('set gitlab token')
    .action((token, options) => {
        setToken(true, token, options)
    })
program
    .command('sethubtoken <token>')
    .alias('sht')
    .option('-f, --force', 'overwrite target directory if it exist')
    .description('set github token')
    .action((token, options) => {
        setToken(false, token, options)
    })
program
    .command('getlabtoken')
    .alias('glt')
    .option('-f, --force', 'overwrite target directory if it exist')
    .description('get gitlab token')
    .action(() => {
        getToken(true)
    })
program
    .command('gethubtoken')
    .alias('ght')
    .option('-f, --force', 'overwrite target directory if it exist')
    .description('get github token')
    .action(() => {
        getToken(false)
    })
program
    .command('setisgitlab <isGitlab>')
    .alias('silt')
    .option('-f, --force', 'overwrite target directory if it exist')
    .description('set is gitlab')
    .action((isGitlab, options) => {
        setIsGitlab(isGitlab, options)
    })
program
    .command('getisgitlab')
    .alias('gil')
    .option('-f, --force', 'overwrite target directory if it exist')
    .description('get is gitlab')
    .action(() => {
        getIsGitlab()
    })
// 解析命令行参数
program.parse(process.argv);
