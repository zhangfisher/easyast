EasyAst

抽象语法树(AST)提供了强大的代码分析和转换功能，一般我们会使用`babel/arcon`等库来进行AST操作。但是这些库的API比较复杂，使用起来不太方便。
`EasyAST`是基于`babel`抽象语法树(AST)工具库，提供了更加简单的API，构造了源代码的对象图，方便我们能更方便地对源代码进行AST操作。

## 安装

```js
npm install easyast
// or
pnpm add easyast
// or
yarn add easyast
```


## 使用

样例代码如下：

```js
// code.js
const x = 1

function print(text){
    console.log(text)
    return true
}

class C extends B{
    static a='a' 
    x=1
    y=2    
    constructor(){
        super();
        console.log('I am C');
    }
    print(a,b){
        console.log('I am print');
    }
    getId(c){
        console.log('I am getId');
        return '1'
    }
    *log(text,...values){

    }
}

```

使用方法如下：

```js
import { EastAST } from "eastast"
import fs from 'fs'
const code = fs.readFileSync('code.js').toString()

// 创建EasyAST对象
const ast = EastAST.parse(code) 
// 

// 遍历所有变量声明
for(const variable of ast.variables()){
    console.log(variable.name)          // 变量名称
    console.log(variable.value)         // 变量值
    console.log(variable.kind)          // 变量类型, var, let, const
    console.log(variable.loc)           // 变量声明在源码中的位置    
    console.log(variable.code)          // 变量声明代码
    console.log(variable.toString())    // 变量声明简化代码
}

// 遍历所有函数
for(const func of ast.functions()){
    console.log(func.name)
    console.log(func.body)
    console.log(func.loc)
    console.log(func.code)
    console.log(func.toString())
    console.log(func.params)
}

// 遍历所有类
for(const cls of ast.classs()){
    console.log(cls.name)
}



```
