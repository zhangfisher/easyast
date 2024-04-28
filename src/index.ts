/***

import { EasyAST } from "easyast";


const ast = new EasyAST(code)

ast.functions

ast.variables

ast.classes

ast.interfaces

ast.enums

ast.types

ast.statements
// 获取指定名称的函数
const func = ast.getFunc(name: string)
func.name
func.args
func.body


 */

import * as parser from "@babel/parser";
import * as t from "@babel/types";
import { isEsmModule } from "./utils";
import { EaModule } from "./module";

export interface EasyASTOptions{
    typescript: boolean;
    sourceType: parser.ParserOptions['sourceType']
    jsx: boolean;             
}


export class EasyAST{
    options: EasyASTOptions;
    body:EaModule 
    constructor(code: string, options?: EasyASTOptions) {
        // 准备配置参数
        const opts = Object.assign({
            typescript:true,
            jsx:true
        },options)
        const babelOptions:parser.ParserOptions = {plugins:[]}
        if(opts.typescript) babelOptions.plugins!.push("typescript")
        if(opts.jsx) babelOptions.plugins!.push("jsx")
        babelOptions.sourceType = isEsmModule(code) ?  'module' : 'script'
        this.options = opts        
        this.body = new EaModule(parser.parse(code,babelOptions).program)        
    }  
    get functions(){return this.body.functions}
    get variables(){return this.body.variables}
    get classs(){return this.body.classs}
    get exports(){return this.body.exports}
    get imports(){return this.body.imports}
    get statements(){return this.body.statements}
    get objects(){return this.body.objects}
    [Symbol.iterator](){
        return this.body[Symbol.iterator]()
    }

}
 
