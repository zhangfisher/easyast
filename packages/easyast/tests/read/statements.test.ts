import { test,expect,describe } from "vitest" 
import { EasyAST } from "../../src"
 

describe("Statements",()=>{

    test("遍历代码块",()=>{
        const code = new EasyAST(`
            let a = 1,b=true,c="a"
            {
                let d = 1,e=2
                const f = 3
                {
                    let g = ()=>{}
                    const h = /^f/g
                }                
            }
            class Animal{}
            class Dog extends Animal{
            }
        `)     
        expect(code.statements.length).toBe(1)
        expect(code.statements[0].type).toBe("BlockStatement") 
    })


})

