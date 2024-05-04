import { test,expect,describe } from "vitest" 
import { EasyAST } from "../../src"
import { beforeAll } from "../utils"

describe("Variables",()=>{ 
    beforeAll()
    test("常量声明",()=>{
        const code = new EasyAST("const x:string = 1")
        expect(code.variables.length).toBe(1)
        expect(code.variables[0].name).toBe("x")
        expect(code.variables[0].value).toBe(1)        
        expect(code.variables[0].kind).toBe("const")
        // typeAnnotation指的是typescript类型声明,tsType指定是AST节点类型
        expect(code.variables[0].typeAnnotation).toBe("string")
        expect(code.variables[0].tsType).toBe("NumericLiteral")
        code.variables[0].name="y"
        expect(code.variables[0].name).toBe("y")
        expect(code.toString()).toBe("const y: string = 1")
    })

    test("声明多个不同基本数据类型的变量",()=>{
        const code = new EasyAST(`
            const x:string = '1',y:number = 2,z:boolean = true
        `)
        expect(code.variables.length).toBe(3)
        expect(code.variables[0].name).toBe("x")
        expect(code.variables[1].name).toBe("y")
        expect(code.variables[2].name).toBe("z")        
        expect(code.variables[0].value).toBe('1')
        expect(code.variables[1].value).toBe(2)
        expect(code.variables[2].value).toBe(true)
        expect(code.variables[0].typeAnnotation).toBe("string")
        expect(code.variables[1].typeAnnotation).toBe("number")
        expect(code.variables[2].typeAnnotation).toBe("boolean")
        expect(code.variables[0].tsType).toBe("StringLiteral")
        expect(code.variables[1].tsType).toBe("NumericLiteral")
        expect(code.variables[2].tsType).toBe("BooleanLiteral")
        expect(code.variables[0].kind).toBe("const")
        expect(code.variables[1].kind).toBe("const")
        expect(code.variables[2].kind).toBe("const")

    })

    test("声明多个未赋值的变量",()=>{
        const code = new EasyAST(`
            let x:string ,y:number ,z:boolean            
        `)
        expect(code.variables.length).toBe(3)
        expect(code.variables[0].name).toBe("x")
        expect(code.variables[1].name).toBe("y")
        expect(code.variables[2].name).toBe("z")
        expect(code.variables[0].value).toBe(undefined)
        expect(code.variables[1].value).toBe(undefined)
        expect(code.variables[2].value).toBe(undefined)
        expect(code.variables[0].typeAnnotation).toBe("string")
        expect(code.variables[1].typeAnnotation).toBe("number")
        expect(code.variables[2].typeAnnotation).toBe("boolean")
        expect(code.variables[0].tsType).toBe(undefined)
        expect(code.variables[1].tsType).toBe(undefined)
        expect(code.variables[2].tsType).toBe(undefined)
        expect(code.variables[0].kind).toBe("let")
        expect(code.variables[1].kind).toBe("let")
        expect(code.variables[2].kind).toBe("let")
    })

    test("声明多个值为表达式的变量",()=>{
        const code = new EasyAST(`
            let a = ()=>{console.log("Hello EasyAST")}
            const b = /^voerkai18n/
            var c = [1,2,3]
            let d ={x:1,y:2,z:3}            
        `)
        expect(code.variables.length).toBe(4)
        expect(code.variables[0].name).toBe("a")
        expect(code.variables[1].name).toBe("b")
        expect(code.variables[2].name).toBe("c")
        expect(code.variables[3].name).toBe("d")
        expect(code.variables[0].value).toBe(`()=>{console.log("Hello EasyAST");}`)
        expect(code.variables[1].value).toBe("/^voerkai18n/")
        expect(code.variables[2].value).toBe("[1,2,3]")
        expect(code.variables[3].value).toBe('{x:1,y:2,z:3}') 
    })
})

