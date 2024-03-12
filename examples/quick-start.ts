import { EasyAST } from "../src/index"

const code = `
const x = 1
let y= x+1
var z = x+(y+100)

function add(a,b,c=100){    
    return a+b+c
}
(a,b,c=100)=>{    
    return a+b+c
}
1+1

{
    let a = 1
    const b = 2
    var c = 3

}


class C extends B{
    static name='fisher' 
    count=100
    constructor(){
        super();
        console.log('I am C');
    }
    print(a,b=100){
        console.log('I am print');
    }
    getId(c){
        console.log('I am getId');
        return '1'
    }
    *log(text,...values){

    }
    get sum(){
        return this.x+this.y
    }
    set sum(value){
        this.x = value
    }
}`

// 创建EasyAST对象
const mod = new EasyAST(code) 
// 

// 遍历所有变量声明
console.log("------variables------")

for(const variable of mod.variables){
    console.log("  declaration: ",variable.declaration)    // 变量声明简化代码    
    console.log(`  ${variable.kind} ${variable.name} = ${variable.value}`)          // 变量类型, var, let, const    
    console.log("")
}
console.log("------functions------")
// 遍历所有函数
for(const func of mod.functions){
    console.log("   ",func.declaration)
    console.log("   name=",func.name)  
    console.log("   async=",func.async)
    console.log("   generator=",func.generator)
    console.log("   arrow function=",func.arrow)    
    console.log("   Returns=",func.returns)
    console.log("   ------arguments------")    

    for(const arg of func.arguments){
        console.log(`      ${arg.name} = ${arg.defaultValue}`)
    }    
    console.log("")   
}
console.log("------classs------")
// 遍历所有类
for(const cls of mod.classs){
    console.log(cls.declaration)
    console.log(cls.name)
    console.log(cls.superClass)
    console.log("   ------properties------")
    for(const prop of cls.properties){        
        console.log(`${prop.name} = ${prop.value}`)
    }

    if(cls.getters.length>0){
        console.log("   ------getters------")
        for(const getter of cls.getters){        
            console.log(`${getter.name} = ${getter.returns}`)
        }
    }
    if(cls.setters.length>0){
        console.log("   ------setters------")
        for(const setter of cls.setters){        
            console.log(`${setter.name} = ${setter.returns}`)
        }
    }
    
    console.log("   ------methods------")
    for(const method of cls.methods){
        console.log(method.declaration)
        console.log("name=",method.name)
        console.log("static=",method.static)
        console.log("abstract=",method.abstract)
        console.log("computed=",method.computed)
        console.log("optional=",method.optional)
        console.log("readonly=",method.readonly)
        console.log("async=",method.async)
        console.log("generator=",method.generator)       

        console.log("------arguments")
        for(const arg of method.arguments){
            console.log(`name= ${arg.name} defaultValue= ${arg.defaultValue}`)
        }
        console.log("")
    }

}