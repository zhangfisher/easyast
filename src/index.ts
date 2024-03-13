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
import { isEsmModule } from "./utils";
import { EaImport } from "./imports";

export interface EasyASTOptions{
    typescript: boolean;
    sourceType: parser.ParserOptions['sourceType']
    jsx: boolean;             
}


export class EasyAST {
    options: EasyASTOptions;
    private _ast:any    
    private _babelParserOptions:parser.ParserOptions={
        plugins:[]
    }
    private body:EaStatement 
    private _imports?:EaImport[]
    constructor(code: string, options?: EasyASTOptions) {
        this.options =Object.assign({
            typescript:true,
        },options)
        this.parse(code); 
        this.body = new EaStatement(this.ast.program,undefined)
    } 
    get ast(){
        return this._ast! 
    }    
    get sourceType(){
        return this._ast.program.sourceType
    }
    private _buildBabelParserOptions(code:string){
        const {sourceType,typescript,jsx} = this.options        
        if(typescript){
            this._babelParserOptions.plugins!.push("typescript")
        }   
        if(jsx){
            this._babelParserOptions.plugins!.push("jsx")
        }
        // 自动判断是否为模块
        if(sourceType===undefined){            
            this._babelParserOptions.sourceType = isEsmModule(code) ?  'module' : 'script'
        }
        return this._babelParserOptions
    }
    /**
     * 解析为Ast
     * @param code 
     */
    private parse(code:string){
        this._ast = parser.parse(code,this._buildBabelParserOptions(code))
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
    get imports():EaImport[]{
        if(!this._imports){
            this._imports = this.ast.body.filter((node:t.Node)=>{
                return t.isImportDeclaration(node)
            }).map((node:t.ImportDeclaration)=>{
                return new EaImport(node)                   
            })
        }
        return this._imports!
    }
    [Symbol.iterator](){
        return this.body[Symbol.iterator]()
    }
}