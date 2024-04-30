import { test,expect,describe } from "vitest" 
import { EasyAST } from "../../src"

 

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
        // expect(run.body.code).toBe("{let a=1,b,c;const x=1;var y=2;function f1(){}function f2(){}class User{}return true;}")
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


    
})

