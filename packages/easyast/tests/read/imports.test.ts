import { test,expect,describe } from "vitest" 
import { EasyAST } from "../../src"

describe("Imports",()=>{  
    test("遍历导入模块",()=>{
        const code = new EasyAST(`
            import a from "a-module"
            import {b,c as C} from "b-module"
            import * as d from "c-module"
            import "d-module"
            import {x,y,type z} from "e-module"
        `)
        const imports = code.imports
        expect(imports.length).toBe(5)
        // import a from "a-module"
        expect(imports[0].specifiers.length).toBe(1)
        expect(imports[0].specifiers[0].name).toBe("a")
        // import {b,c as C} from "b-module"
        expect(imports[1].specifiers.length).toBe(2)
        expect(imports[1].specifiers[0].name).toBe("b")
        expect(imports[1].specifiers[1].name).toBe("c")
        expect(imports[1].specifiers[1].local).toBe("C")

        // import * as d from "c-module"
        expect(imports[2].specifiers.length).toBe(1)
        expect(imports[2].specifiers[0].name).toBe("d")

        // import "d-module"
        expect(imports[3].specifiers.length).toBe(0)
        
        // import {x,y,type z} from "e-module"
        expect(imports[4].specifiers.length).toBe(3)
        expect(imports[4].specifiers[0].name).toBe("x")
        expect(imports[4].specifiers[1].name).toBe("y")
        expect(imports[4].specifiers[2].name).toBe("z")
        expect(imports[4].specifiers[2].kind).toBe("type")



        expect(imports[0].source).toBe("a-module")
        expect(imports[1].source).toBe("b-module")
        expect(imports[2].source).toBe("c-module")
        expect(imports[3].source).toBe("d-module")
        expect(imports[4].source).toBe("e-module")


    })
    
    test("遍历模块导入信息",()=>{
        const code = new EasyAST(`
            import {a,b as B,c} from "a-module"
            import * as d from "b-module"
            import e from "c-module"
            import "d-module"
            import {x,y,type z} from "e-module"
            import type {m,n} from "f-module"
        `)
        expect(code.sourceType).toBe("module")
        expect(code.imports.length).toBe(6)
        expect(code.imports[0].specifiers.length).toBe(3)
        expect(code.imports[0].specifiers[0].local).toBe("a")
        expect(code.imports[0].specifiers[0].name).toBe("a")
        expect(code.imports[0].specifiers[1].name).toBe("b")
        expect(code.imports[0].specifiers[1].local).toBe("B")
        expect(code.imports[0].specifiers[2].name).toBe("c")
        expect(code.imports[0].specifiers[2].local).toBe("c")
        expect(code.imports[0].source).toBe("a-module")

        expect(code.imports[1].specifiers.length).toBe(1)
        expect(code.imports[1].specifiers[0].local).toBe("d")
        expect(code.imports[1].specifiers[0].name).toBe("d")
        expect(code.imports[1].source).toBe("b-module")

        expect(code.imports[2].specifiers.length).toBe(1)
        expect(code.imports[2].specifiers[0].local).toBe("e")
        expect(code.imports[2].specifiers[0].name).toBe("e")
        expect(code.imports[2].source).toBe("c-module")

        expect(code.imports[3].specifiers.length).toBe(0)
        expect(code.imports[3].specifiers.length).toBe(0)
        expect(code.imports[3].source).toBe("d-module")

        expect(code.imports[4].specifiers.length).toBe(3)
        expect(code.imports[4].specifiers[0].local).toBe("x")
        expect(code.imports[4].specifiers[0].name).toBe("x")
        expect(code.imports[4].specifiers[1].local).toBe("y")
        expect(code.imports[4].specifiers[1].name).toBe("y")
        expect(code.imports[4].specifiers[2].local).toBe("z")
        expect(code.imports[4].specifiers[2].name).toBe("z")
        expect(code.imports[4].specifiers[2].kind).toBe("type")
        expect(code.imports[4].source).toBe("e-module")

        expect(code.imports[5].specifiers.length).toBe(2)
        expect(code.imports[5].specifiers[0].local).toBe("m")
        expect(code.imports[5].specifiers[0].name).toBe("m")
        expect(code.imports[5].specifiers[0].kind).toBe("type")
        expect(code.imports[5].specifiers[1].local).toBe("n")
        expect(code.imports[5].specifiers[1].name).toBe("n")
        expect(code.imports[5].specifiers[1].kind).toBe("type")
        expect(code.imports[5].source).toBe("f-module")
    })
})
