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

export interface EasyASTOptions{
    typescript: boolean;
    jsx: boolean;    
    plugins:any[],
}

export class EasyAST {
    options: EasyASTOptions;
    private _ast:any
    constructor(code: string, options?: EasyASTOptions) {
        this.options =Object.assign({},options)
        this.parse(code); 
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
     * 获取所有函数 
     */
    get functions(){
        return this.ast.program.body.filter((node:any)=>t.isFunctionDeclaration(node))
    }
    


}