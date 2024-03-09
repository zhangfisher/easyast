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
import type {} from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { FlexIterator } from "./utils";
import { EaFunction } from "./function";
import { EaStatement } from "./statement";

export interface EasyASTOptions{
    typescript: boolean;
    jsx: boolean;    
    plugins:any[],
    /**
     * 获取字面量的值
     * @param node 
     */
    getLitervalValue(node:t.Literal):any
}



export class EasyAST{
    options: EasyASTOptions;
    private _ast:any
    private body:EaStatement 
    constructor(code: string, options?: EasyASTOptions) {
        this.options =Object.assign({},options)
        this.parse(code); 
        this.body = new EaStatement(this.ast.program,undefined,this)
    }
    get ast(){
        return this._ast!
    }
    /**
     * 解析为Ast
     * @param code 
     */
    private parse(code:string){
        this._ast = parser.parse(code)
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


}