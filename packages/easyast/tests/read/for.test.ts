import { test,expect,describe } from "vitest" 
import { EaExpression, EaForOfStatement, EaForStatement, EaVariable, EasyAST } from "../../src"

 
describe("For",()=>{  
    test("循环语句：For",()=>{
        const code = new EasyAST(`     
            for(let i=0;i<10;i++){
                1
            }
        `)
        expect(code.statements.length).toBe(1) 
        const forLoop = code.statements[0] as EaForStatement<EaVariable[]>
        expect(forLoop.type).toBe("ForStatement")
        expect(Array.isArray(forLoop.init) && forLoop.init[0]).toBeInstanceOf(EaVariable)
        const init = Array.isArray(forLoop.init) ? forLoop.init[0]  : undefined
        expect(init!.kind).toBe("let")
        expect(init!.name).toBe("i")
        expect(init!.value).toBe(0)
        expect(forLoop.condition).toBeInstanceOf(EaExpression)
    })
    test("循环语句:ForOf",()=>{
        const code = new EasyAST(`     
            for(let [value,index] of [1,2,3]){
                1
            }
            for(let value of [1,2,3]){
                1
            }
        `)
        expect(code.statements.length).toBe(1) 
        const forLoop = code.statements[0] as EaForOfStatement

    })
    test("循环语句:ForIn",()=>{
        const code = new EasyAST(`     
            for(let [value,index] of [1,2,3]){
                1
            }
        `)
        expect(code.statements.length).toBe(1)

    })
})
 