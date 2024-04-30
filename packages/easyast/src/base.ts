import * as t from "@babel/types"
import traverse, { Scope } from "@babel/traverse"; 
import generate from '@babel/generator';



export interface EaObjectOptions extends Record<string,any>{

    // 代码生成选项
    retainLines?:boolean,
    compact?:boolean
}


export class EaObject<Node extends t.Node=t.Node,ParentNode extends t.Node= t.Node>{
    static generator = (node:t.Node)=>generate(node,{retainLines:false,compact:false})
    private _ast?:Node
    private _parentAst?:ParentNode
    private _options:Required<EaObjectOptions>  
    /**
     * 
     * @param node      
     * @param parentNode  指定的是节点的上下文AST节点，用来确定节点所在的位置，如变量声明的上下文指的是所在的函数，函数是所在的父函数
     */
    constructor(node:Node | string,parentNode?:ParentNode,options?:EaObjectOptions){
        this._options = Object.assign({ retainLines:false,compact:false},options)
        if(t.isNode(node)){
            this._ast = node as Node
        }else if(typeof(node)=='string'){ //创建对象是使用
            this._ast = this.createAstNode(node) as unknown as Node
        }else{
            throw new Error("node must be ASTNode or string code")        
        }
        this._parentAst = parentNode
    }
    get options(){return this._options}
    get type(){ return this._ast!.type}
    get ast(){return this._ast!}
    get parentAst(){ return this._parentAst }    
    get loc(){return this.ast.loc}    
    get code(){return (this.constructor as any).generator(this.ast).code}  

    /**
     * 供子类实现用来构建对应的Ast节点
     * @param code 
     * @returns 
     */
    protected createAstNode(code:string){        
        throw new Error("createAstNode must be implemented")
    }    
    /**
    *  该函数是否有导出
    */
    get isExported(){
        return this.parentAst && t.isExportNamedDeclaration(this.parentAst)
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