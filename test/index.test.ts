import { test,expect,describe, beforeEach } from "vitest"
import fs from "fs-extra"
import path from "path"
import { EasyAST } from "../src"



describe("jscode",()=>{
    const jscode = fs.readFileSync(path.join(__dirname,"code.js")).toString()
    let code = new EasyAST(jscode)
    beforeEach(()=>{
    
    })    
    test("test",()=>{
        for(const func of code.functions){
            console.log(func.name,'async=',func.async,"generator=",func.generator)
            for(const arg of func.args){
                console.log(arg.name ,'=' ,arg.defaultValue)
            }
            console.log("------")
        }


        expect(1).toBe(1)
    })
})
