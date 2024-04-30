import { test,expect,describe } from "vitest" 
import { EasyAST } from "../../src"

 
describe("For",()=>{  
    test("循环语句：For",()=>{
        const code = new EasyAST(`     
            for(let i=0;i<10;i++){
                1
            }
        `)
        expect(code.statements.length).toBe(1) 

    })
    test("循环语句:ForOf",()=>{
        const code = new EasyAST(`     
            for(let [value,index] of [1,2,3]){
                1
            }
        `)
        expect(code.statements.length).toBe(1) 

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
 