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
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { EaStatement } from "./statement";

export interface EasyASTOptions{
    typescript: boolean;
    jsx: boolean;        
    babelParserOptions:parser.ParserOptions
}


export class EasyAST {
    options: EasyASTOptions;
    private _ast:any
    private body:EaStatement 
    constructor(code: string, options?: EasyASTOptions) {
        this.options =Object.assign({
            typescript:true,
            babelParserOptions:{
                plugins:[]
            }
        },options)
        this.parse(code); 
        this.body = new EaStatement(this.ast.program,undefined)
    } 
    get ast(){
        return this._ast! 
    }
    /**
     * 解析为Ast
     * @param code 
     */
    private parse(code:string){
        const opts = {...this.options.babelParserOptions}
        if(!opts.plugins) opts.plugins = []
        if(this.options.typescript){
            opts.plugins.push("typescript")
        }        
        this._ast = parser.parse(code,opts)
    }
    /**
     * 获取所有函数的迭代器
     */
    get functions(){
        return this.body.functions
    }
    /**
     * 返回获取所有变量声明的迭代器
     */
    get variables(){
        return this.body.variables
    }
    /**
     * 返回获取所有类声明的迭代器
     */
    get classs(){
        return this.body.classs
    }
    get statements(){
        return this.body.statements
    } 
    [Symbol.iterator](){
        return this.body[Symbol.iterator]()
    }
}