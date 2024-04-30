import { test,expect,describe } from "vitest" 
import { EasyAST } from "../../src"
 


describe("Functions",()=>{

    test("基本函数声明",()=>{
        const code = new EasyAST(`
            function f1(){} 
            function f2(a){                
                return 1
            } 
            function f3(x,z,...y){                
                let a = 1
                return a
            } 
        `)
        
        expect(code.functions.length).toBe(3)
        expect(code.functions[0].name).toBe("f1")
        expect(code.functions[1].name).toBe("f2")
        expect(code.functions[2].name).toBe("f3")
        
        expect(code.functions[0].body.code).toBe("{}")
        //expect(code.functions[1].body.code).toBe("{return 1;}")
        //expect(code.functions[2].body.code).toBe("{let a=1;return a;}")
        
        expect(code.functions[0].arguments.length).toBe(0)
        expect(code.functions[1].arguments.length).toBe(1)
        expect(code.functions[1].arguments.map(arg=>arg.name).join(",")).toBe("a")
        expect(code.functions[2].arguments.length).toBe(3)
        expect(code.functions[2].arguments.map(arg=>arg.name).join(",")).toBe("x,z,y")

        expect(code.functions[0].returns.value).toBe(undefined)
        expect(code.functions[1].returns.value).toBe(1)
        expect(code.functions[2].returns.value).toBe("a")

    })
    test("访问函数参数",()=>{
        const code = new EasyAST(`            
            function fn(a,b=1,c="a",d=true,e={},f=[],g=()=>{},h=x+y,i=/^f/g,...z){                
                let result = 1
                return result
            } 
        `)
        expect(code.functions.length).toBe(1)
        expect(code.functions[0].name).toBe("fn")
        expect(code.functions[0].arguments.length).toBe(10)
        expect(code.functions[0].arguments.map(arg=>arg.name).join(",")).toBe("a,b,c,d,e,f,g,h,i,z")

        expect(code.functions[0].arguments[0].name).toBe("a")
        expect(code.functions[0].arguments[0].defaultValue).toBe(undefined)

        expect(code.functions[0].arguments[1].name).toBe("b")
        expect(code.functions[0].arguments[1].defaultValue).toBe(1)

        expect(code.functions[0].arguments[2].name).toBe("c")
        expect(code.functions[0].arguments[2].defaultValue).toBe("a")
        
        expect(code.functions[0].arguments[3].name).toBe("d")
        expect(code.functions[0].arguments[3].defaultValue).toBe(true)

        expect(code.functions[0].arguments[4].name).toBe("e")
        expect(code.functions[0].arguments[4].defaultValue).toBe("{}")

        expect(code.functions[0].arguments[5].name).toBe("f")
        expect(code.functions[0].arguments[5].defaultValue).toBe("[]")

        expect(code.functions[0].arguments[6].name).toBe("g")
        expect(code.functions[0].arguments[6].defaultValue).toBe("()=>{}")

        expect(code.functions[0].arguments[7].name).toBe("h")
        expect(code.functions[0].arguments[7].defaultValue).toBe("x+y")
            
        expect(code.functions[0].arguments[8].name).toBe("i")
        expect(code.functions[0].arguments[8].defaultValue).toBe("/^f/g")

        expect(code.functions[0].arguments[9].name).toBe("z")
        expect(code.functions[0].arguments[9].rest).toBe(true)
        expect(code.functions[0].arguments[9].defaultValue).toBe(undefined)

    })
    test("访问函数参数的类型注释",()=>{
        const code = new EasyAST(`            
            function fn(a:string,b:number | boolean=1,c:string | string[]="a",d:boolean=true,e:Record<string,any>={},f:Array<number>=[],g:(...args)=>{}=()=>{},h:Dict=x+y,i:Regexp=/^f/g,...z:any[]):number{                
                let result = 1
                return result
            } 
        `)
        expect(code.functions[0].arguments[0].typeAnnotation).toBe("string")
        expect(code.functions[0].arguments[1].typeAnnotation).toBe("number | boolean")
        expect(code.functions[0].arguments[2].typeAnnotation).toBe("string | string[]")
        expect(code.functions[0].arguments[3].typeAnnotation).toBe("boolean")
        expect(code.functions[0].arguments[4].typeAnnotation).toBe("Record<string, any>")
        expect(code.functions[0].arguments[5].typeAnnotation).toBe("Array<number>")
        expect(code.functions[0].arguments[6].typeAnnotation).toBe("(...args) => {}")
        expect(code.functions[0].arguments[7].typeAnnotation).toBe("Dict")
        expect(code.functions[0].arguments[8].typeAnnotation).toBe("Regexp")
        expect(code.functions[0].arguments[9].typeAnnotation).toBe("any[]")

    
    })
    test("函数返回值",()=>{
        const code = new EasyAST(`            
            function f1(){} 
            function f2(){return 1} 
            function f3(){return "1"}
            function f4(){return true}
            function f5(){return {}}
            function f6(){return []}
            function f7(){return ()=>{}}
            function f8(){return /^f/g}
            function f9(){return x+y}
            function f10(){return new Date()}
        `)
        expect(code.functions.length).toBe(10)
        expect(code.functions[0].returns.value).toBe(undefined)
        expect(code.functions[1].returns.value).toBe(1)
        expect(code.functions[2].returns.value).toBe("1")
        expect(code.functions[3].returns.value).toBe(true)
        expect(code.functions[4].returns.value).toBe("{}")
        expect(code.functions[5].returns.value).toBe("[]")
        expect(code.functions[6].returns.value).toBe("()=>{}")
        expect(code.functions[7].returns.value).toBe("/^f/g")
        expect(code.functions[8].returns.value).toBe("x+y")
        expect(code.functions[9].returns.value).toBe("new Date()")
    })
    test("函数返回值的类型注解",()=>{
        const code = new EasyAST(`            
            function f1():any{} 
            function f2():number{return 1} 
            function f3():string{return "1"}
            function f4():boolean{return true}
            function f5():Record<string,any>{return {}}
            function f6():Array<any>{return []}
            function f7():(...args:any[])=>boolean{return ()=>{}}
            function f8():RegExp{return /^f/g}
            function f9():object{return x+y}
            function f10():Date{return new Date()}
        `)
        expect(code.functions[0].returns.typeAnnotation).toBe("any")
        expect(code.functions[1].returns.typeAnnotation).toBe("number")
        expect(code.functions[2].returns.typeAnnotation).toBe("string")
        expect(code.functions[3].returns.typeAnnotation).toBe("boolean")
        expect(code.functions[4].returns.typeAnnotation).toBe("Record<string, any>")
        expect(code.functions[5].returns.typeAnnotation).toBe("Array<any>")
        expect(code.functions[6].returns.typeAnnotation).toBe("(...args: any[]) => boolean")
        expect(code.functions[7].returns.typeAnnotation).toBe("RegExp")
        expect(code.functions[8].returns.typeAnnotation).toBe("object")
        expect(code.functions[9].returns.typeAnnotation).toBe("Date")
    })
    test("访问函数体",()=>{
        const code = new EasyAST(`            
            function fn(){
                let a = 1,b,c
                const x = 1
                var y = 2
                function f1(){}
                function f2(){}
                class User{}
                return a+b+c
            }             
        `)
        const fn = code.functions[0]
        //fexpect(fn.body.code).toBe("{let a=1,b,c;const x=1;var y=2;function f1(){}function f2(){}class User{}return a+b+c;}")
        expect(fn.body.functions.length).toBe(2)
        expect(fn.body.functions[0].name).toBe("f1")
        expect(fn.body.functions[1].name).toBe("f2")
        expect(fn.body.variables.length).toBe(5)
        expect(fn.body.variables.map(v=>v.name)).toEqual(["a","b","c","x","y"])
        expect(fn.body.classs.length).toBe(1)
        expect(fn.body.classs[0].name).toBe("User")
    }) 
})
