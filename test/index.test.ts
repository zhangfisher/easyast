import { test,expect,describe, beforeEach } from "vitest"
import fs from "fs-extra"
import path from "path"
import { EasyAST } from "../src"


describe("Variables",()=>{

    beforeEach(()=>{
    
    })    

    test("常量声明",()=>{
        const code = new EasyAST("const x:string = 1")
        expect(code.variables.length).toBe(1)
        expect(code.variables[0].name).toBe("x")
        expect(code.variables[0].value).toBe(1)        
        expect(code.variables[0].kind).toBe("const")
        // typeAnnotation指的是typescript类型声明,valueType指定是AST节点类型
        expect(code.variables[0].typeAnnotation).toBe("string")
        expect(code.variables[0].valueType).toBe("NumericLiteral")
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
        expect(code.variables[0].valueType).toBe("StringLiteral")
        expect(code.variables[1].valueType).toBe("NumericLiteral")
        expect(code.variables[2].valueType).toBe("BooleanLiteral")
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
        expect(code.variables[0].valueType).toBe(undefined)
        expect(code.variables[1].valueType).toBe(undefined)
        expect(code.variables[2].valueType).toBe(undefined)
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
        expect(code.functions[1].body.code).toBe("{return 1;}")
        expect(code.functions[2].body.code).toBe("{let a=1;return a;}")
        
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
        expect(fn.body.code).toBe("{let a=1,b,c;const x=1;var y=2;function f1(){}function f2(){}class User{}return a+b+c;}")
        expect(fn.body.functions.length).toBe(2)
        expect(fn.body.functions[0].name).toBe("f1")
        expect(fn.body.functions[1].name).toBe("f2")
        expect(fn.body.variables.length).toBe(5)
        expect(fn.body.variables.map(v=>v.name)).toEqual(["a","b","c","x","y"])
        expect(fn.body.classs.length).toBe(1)
        expect(fn.body.classs[0].name).toBe("User")
    }) 
})

describe("Classs",()=>{

    test("基本类声明",()=>{
        const code = new EasyAST(`
            class Animal{}
            class Dog extends Animal{
            }
        `)
        expect(code.classs.length).toBe(2)
        expect(code.classs[0].name).toBe("Animal")
        expect(code.classs[1].name).toBe("Dog")
        expect(code.classs[1].superClass).toBe("Animal")
    })

    test("遍历类方法",()=>{
        const code = new EasyAST(`
            class Animal{
                constructor(){}
                public eat(){}
                public run(){}
                private sleep(){}
                protected jump(){}
            }            
        `) 
        const animal = code.classs[0]
        expect(animal.methods.length).toBe(5)
        expect(animal.methods[0].name).toBe("constructor")
        expect(animal.methods[1].name).toBe("eat")
        expect(animal.methods[2].name).toBe("run")
        expect(animal.methods[3].name).toBe("sleep")
        expect(animal.methods[4].name).toBe("jump")
        expect(animal.methods[0].accessibility).toBe("public")
        expect(animal.methods[1].accessibility).toBe("public")
        expect(animal.methods[2].accessibility).toBe("public")
        expect(animal.methods[3].accessibility).toBe("private")
        expect(animal.methods[4].accessibility).toBe("protected")
    })
    test("读取类方法的各种属性",()=>{
        const code = new EasyAST(`
            class Animal{ 
                private async run(speed:number):boolean{
                    let a = 1,b,c
                    const x = 1
                    var y = 2
                    function f1(){}
                    function f2(){}
                    class User{}
                    return true
                } 
            }            
        `) 
        const animal = code.classs[0]
        expect(animal.methods.length).toBe(1)
        const run = animal.methods[0]
        expect(run.name).toBe("run")
        expect(run.accessibility).toBe("private")
        expect(run.async).toBe(true)
        expect(run.generator).toBe(false)
        expect(run.arrow).toBe(false)
        expect(run.arguments.length).toBe(1)
        expect(run.arguments[0].name).toBe("speed")
        expect(run.arguments[0].typeAnnotation).toBe("number")
        expect(run.returns.value).toBe(true)
        expect(run.returns.typeAnnotation).toBe("boolean")
        expect(run.body.code).toBe("{let a=1,b,c;const x=1;var y=2;function f1(){}function f2(){}class User{}return true;}")
        expect(run.body.variables.length).toBe(5)
        expect(run.body.functions.length).toBe(2)
        expect(run.body.classs.length).toBe(1)
        expect(run.body.classs[0].name).toBe("User")        
    })
    test("遍历类属性",()=>{
        const code = new EasyAST(`
            class Animal{ 
                private age:number = 100
                public name:string = 'fisher'
                protected weight:number = ()=>200
                static count:number = x
                readonly type:string = 'dog'
            }            
        `) 
        const animal = code.classs[0]
        expect(animal.properties.length).toBe(5)
        expect(animal.properties[0].name).toBe("age")
        expect(animal.properties[1].name).toBe("name")
        expect(animal.properties[2].name).toBe("weight")
        expect(animal.properties[3].name).toBe("count")
        expect(animal.properties[4].name).toBe("type")

        expect(animal.properties[0].accessibility).toBe("private")
        expect(animal.properties[1].accessibility).toBe("public")
        expect(animal.properties[2].accessibility).toBe("protected")
        expect(animal.properties[3].accessibility).toBe("public")
        expect(animal.properties[4].accessibility).toBe("public")

        expect(animal.properties[0].static).toBe(false)
        expect(animal.properties[1].static).toBe(false)
        expect(animal.properties[2].static).toBe(false)
        expect(animal.properties[3].static).toBe(true)
        expect(animal.properties[4].static).toBe(false)

        expect(animal.properties[0].readonly).toBe(false)
        expect(animal.properties[1].readonly).toBe(false)
        expect(animal.properties[2].readonly).toBe(false)
        expect(animal.properties[3].readonly).toBe(false)
        expect(animal.properties[4].readonly).toBe(true)

        expect(animal.properties[0].typeAnnotation).toBe("number")
        expect(animal.properties[1].typeAnnotation).toBe("string")
        expect(animal.properties[2].typeAnnotation).toBe("number")
        expect(animal.properties[3].typeAnnotation).toBe("number")
        expect(animal.properties[4].typeAnnotation).toBe("string")

        expect(animal.properties[0].value).toBe(100)
        expect(animal.properties[1].value).toBe("fisher")
        expect(animal.properties[2].value).toBe("()=>200")
        expect(animal.properties[3].value).toBe("x")
        expect(animal.properties[4].value).toBe("dog")

    })

    test("遍历类Getters和Setters",()=>{
        const code = new EasyAST(`
            class Animal{ 
                get age():number{
                    return 100                
                }
                set age(value:number){
                }
                private get name():string{
                    return 'fisher'
                }
                private set name(value:string){
                }
                protected get weight():number{
                    return 200
                }                
                private set weight(value:number){
                }                
            }            
        `) 
        const animal = code.classs[0]
        expect(animal.getters.length).toBe(3)
        
        expect(animal.getters[0].name).toBe("age")
        expect(animal.getters[1].name).toBe("name")
        expect(animal.getters[2].name).toBe("weight")

        expect(animal.getters[0].typeAnnotation).toBe("number")
        expect(animal.getters[1].typeAnnotation).toBe("string")
        expect(animal.getters[2].typeAnnotation).toBe("number")

        expect(animal.setters.length).toBe(3)
        expect(animal.setters[0].name).toBe("age")
        expect(animal.setters[1].name).toBe("name")
        expect(animal.setters[2].name).toBe("weight")

        expect(animal.setters[0].typeAnnotation).toBe("number")
        expect(animal.setters[1].typeAnnotation).toBe("string")
        expect(animal.setters[2].typeAnnotation).toBe("number")
    })
    test("访问类的构造器",()=>{
        const code = new EasyAST(`
            class Animal{ 
                constructor(public name,private age=100){
                }
            }
        `)
        expect(code.classs[0].name).toBe("Animal")        
        const constructor = code.classs[0].getConstructor()!
        expect(constructor.name).toBe("constructor")
        expect(constructor.arguments.length).toBe(2)
        expect(constructor.arguments[0].name).toBe("name")
        expect(constructor.arguments[0].accessibility).toBe("public")
        expect(constructor.arguments[0].defaultValue).toBe(undefined)
        expect(constructor.arguments[1].name).toBe("age")
        expect(constructor.arguments[1].accessibility).toBe("private")
        expect(constructor.arguments[1].defaultValue).toBe(100)

    })
    test("判断源代码类型",()=>{
        const code1 = new EasyAST(`
            class Animal{ 
                constructor(public name,private age=100){
                }
            }
        `)
        expect(code1.sourceType).toBe("script")
        const code2 = new EasyAST(`
            export class Animal{ 
                constructor(public name,private age=100){
                }
            }
        `)
        expect(code2.sourceType).toBe("module")
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
    test("读取模块的导出信息",()=>{
        const code = new EasyAST(`
            const a = 1
            let b = 2
            export { a, b }
            export const x=true
            export class C{}
            export function f(){}
            export default function(){}
            export = 1
            export * from './anotherModule';
        `)
        expect(code).toBe(6)

    })
})