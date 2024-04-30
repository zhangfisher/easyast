import { test,expect,describe } from "vitest" 
import { EasyAST } from "../../src"
 

describe("Expression",()=>{  
    test("表达式功能测试",()=>{
        const code = new EasyAST(`        
            (()=>{})()
            a
            b=2
            1+1
            a+b+c
            x.y.z
            f1()
            b.test()
            new Date()
            x.y.z() 
        `)
        expect(code.expressions.length).toBe(10)

    })
})

