import { test,expect,describe } from "vitest" 
import { EasyAST } from "../../src"

 

describe("Exports",()=>{  
    test("遍历模块的导出",()=>{
        const code = new EasyAST(`
            export function f1(){}    
            export const a =1 ,b=2, c=3,d = ()=>1, e = /^f/g            
            export const f2=()=>{}
            export class C{}
            export {a,f1,C as C1}            
            export default function(){}    
            export {b1,b2 as b200} from "b-module"     
            export * from "a-module"         
            export * from "a-module?111"       
            export * from "a-module/x/v"       
            export * from "aa:a-module/x/v"       
            export * as cmodule from "c-module"                     
        `) 
        expect(code.functions.length).toBe(2)
        expect(code.variables.length).toBe(6)
        expect(code.classs.length).toBe(1)
        expect(code.exports.length).toBe(7)

        expect(code.variables[0].name).toBe("a")
        expect(code.variables[1].name).toBe("b")
        expect(code.variables[2].name).toBe("c")
        expect(code.variables[3].name).toBe("d")
        expect(code.variables[4].name).toBe("e")
        expect(code.variables[5].name).toBe("f2")

        expect(code.variables[0].exported).toBe(true)

    })
})
