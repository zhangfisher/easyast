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
    console.log("returns=",func.returns)
    console.log("variables=",[...func.body.variables].map(v=>v.name).join(","))
    console.log("------")
}

console.log("------ classs ------")
for(const cls of code.classs){
    console.log(cls.toString())
    console.log("parent class:",cls.super)
    console.log("methods:")
    for(const method of cls.methods){
        console.log("   ",method.toString())
    }
    console.log("properties:")
    for(const property of cls.properties){
        console.log("   name=",property.name,"  ", property.toString())
    }
    console.log("------")
}
