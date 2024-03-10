import * as t from "@babel/types"
import generate from "@babel/generator";

export interface IEaObject extends Record<string,any>{

}
 

export class EaObject<AST extends t.Node=t.Node,Props extends IEaObject = IEaObject>{
    private _ast?:AST
    private _parentAst?:t.Node
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
    get parent(){ return this._parentAst }
    get ast(){return this._ast!}
    get loc(){return this.ast.loc}
    get nodeType(){ return this.ast.type }
    get code(){
        return generate(this.ast,{
            retainLines:false,
            compact:true
        }).code
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
     * 代码的简短描述
     * 如函数
     *    function a(){}
     *  
     */
    toString(){
        return this.code   
    }
    findFunction(name:string){

    }
    findLiteral(value:any){

    }
    findVariable(name:string){

    }
    findClass(name:string){

    }

}