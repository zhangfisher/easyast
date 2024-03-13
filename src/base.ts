import * as t from "@babel/types"
import generate from "@babel/generator";
import traverse, { Scope } from "@babel/traverse"; 
import { getTypeAnnotation } from "./utils";

export interface IEaObjectProps extends Record<string,any>{

}
 

export class EaObject<AST extends t.Node=t.Node,Props extends IEaObjectProps = IEaObjectProps>{
    private _ast?:AST
    private _parentAst?:t.Node
    /**
     * 
     * @param node      
     * @param parentNode  指定的是节点的上下文AST节点，用来确定节点所在的位置，如变量声明的上下文指的是所在的函数，函数是所在的父函数
     */
    constructor(node:t.Node | Props,parentNode?:t.Node){
        if(t.isNode(node)){
            this._ast = node as AST
        }else if(typeof(node)=='object'){
            this._ast = this.createAstNode(node) as unknown as AST
        }else{
            throw new Error("node must be AstNode or Object")        
        }
        this._parentAst = parentNode
    }
    get type(){ return this._ast!.type}
    get ast(){return this._ast!}
    get parentAst(){ return this._parentAst }    
    get loc(){return this.ast.loc}
    get nodeType(){ return this.ast.type }
    get code(){
        return generate(this.ast,{
            retainLines:false,
            compact:true
        }).code
    }    
    /**
     * 获取当前节点的上下文
     */
    get context(){
        return 
    }
    /**
     * 供子类实现用来构建对应的Ast节点
     * @param props 
     * @returns 
     */
    protected createAstNode(props:Props){        
        throw new Error("createAstNode must be implemented")
    }
    /**
     * 获取节点的声明代码
     * 对于函数不包含函数体
     * 
     */
    get declaration(){
        return this.toString()
    }
    toString(){
        return this.code   
    }
    /**
     * 在当前节点上查找函数
     * @param name 
     */
    findFunction(name:string,options?:{deep:false,scope?:Scope}){
        const opts = Object.assign({deep:false},options)
        traverse(this.ast,{
            FunctionDeclaration(path){
                console.log(path)
            }
        },opts.scope)
    }
    findLiteral(value:any){

    }
    findVariable(name:string){

    }
    findClass(name:string){

    }
}