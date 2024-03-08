import { test,expect,describe, beforeEach } from "vitest"
import fs from "fs-extra"
import path from "path"
import { EasyAST } from "../src"



describe("jscode",()=>{
    const jscode = fs.readFileSync(path.join(__dirname,"code.js")).toString()
    let ast = new EasyAST(jscode)
    beforeEach(()=>{
    
    })    
    test("test",()=>{
        console.log(jscode)
        expect(1).toBe(1)
    })
})
