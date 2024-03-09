import fs from "fs-extra"
import path from "path"
import { EasyAST } from "../src"


const jscode = fs.readFileSync(path.join(__dirname,"code/js-code.js")).toString()
const code = new EasyAST(jscode)


console.log("------ variables ------")
for(const varObj of code.variables){
    console.log(varObj.toString())
}
console.log("------ functions ------")
for(const func of code.functions){
    console.log(func.toString())
}

