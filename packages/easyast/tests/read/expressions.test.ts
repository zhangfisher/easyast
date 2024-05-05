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
            !x
        `)
        expect(code.expressions.length).toBe(11)
        expect(code.expressions[0].type).toBe("CallExpression")
        expect(code.expressions[1].type).toBe("Identifier")
        expect(code.expressions[2].type).toBe("AssignmentExpression")
        expect(code.expressions[3].type).toBe("BinaryExpression")
        expect(code.expressions[4].type).toBe("BinaryExpression")
        expect(code.expressions[5].type).toBe("MemberExpression")
        expect(code.expressions[6].type).toBe("CallExpression")
        expect(code.expressions[7].type).toBe("CallExpression")
        expect(code.expressions[8].type).toBe("NewExpression")
        expect(code.expressions[9].type).toBe("CallExpression")
        expect(code.expressions[10].type).toBe("UnaryExpression")


    })
})

