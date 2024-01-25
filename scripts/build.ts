import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'url'

export const __filename = fileURLToPath(import.meta.url)
export const dirname = path.dirname(__filename);

export const packageJsonPath = path.resolve(dirname, "../package.json");
const mdPath = path.resolve(dirname, '../README.md')
const distPath = path.resolve(dirname, '../dist')

const distJsonPath = path.resolve(dirname, "../dist/package.json");
const distMDPath = path.resolve(dirname, "../dist/README.md");  
const psJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const uniCli = "uni-cli";
psJson.bin[uniCli] = "esm/index.js";
psJson.main = "esm/index.js";
psJson.module = "esm/index.js";
delete psJson.scripts;

if(fs.existsSync(distPath)) {
    fs.writeFileSync(distJsonPath, JSON.stringify(psJson, null, 4));
    fs.copyFileSync(mdPath, distMDPath);
}