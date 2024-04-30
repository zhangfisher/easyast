import { test,expect,describe, beforeAll } from "vitest" 
import { EaIfStatement, EaObject, EasyAST } from "../../src"
import { codeGenerator } from "../utils" 

describe("If",()=>{  
    beforeAll(()=>{
        EaObject.generator = codeGenerator
    })
    test("完整条件语句",()=>{
        const code = new EasyAST(`     
            if(a==0){
                0
            }else if(a==1 & b==2){
                1
            }else if(a==2){
                2
            }else{
                1000
            }
        `)
        expect(code.statements.length).toBe(1) 
        expect(code.statements[0].type).toBe("IfStatement")
        const ifStatement = code.statements[0] as EaIfStatement
        expect(ifStatement.condition.code).toBe('a==0')
        expect(ifStatement.if.code).toBe('{0;}')
        expect(ifStatement.elseIf.length).toBe(2)
        expect(ifStatement.elseIf[0].condition.code).toBe("a==1&b==2")
        expect(ifStatement.elseIf[0].body.code).toBe("{1;}")

        expect(ifStatement.elseIf[1].condition.code).toBe("a==2")
        expect(ifStatement.elseIf[1].body.code).toBe("{2;}")

        expect(ifStatement.elseIf.length).toBe(2)
        expect(ifStatement.else!.code).toBe('{1000;}')
    })
}) 
