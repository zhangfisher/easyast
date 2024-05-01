import * as t from '@babel/types';
import { getAstLiteralValue, getAstNodeCode, getTypeAnnotation } from './utils';
import { EaArguemnt } from './arguemnt';
import { EaObject } from './base';
import { EaBlockStatement } from './statement'; 
 
 
export class EaFunctionReturns extends EaObject<t.ReturnStatement>{
    private _typeAnnotation
    constructor(ast:t.ReturnStatement,typeAnnotation?:t.FunctionDeclaration['returnType']){
        super(ast)
        this._typeAnnotation = typeAnnotation
    }
    get value(){
        const returnNode = this.ast
        if(!returnNode.argument) return undefined
        if(t.isLiteral(returnNode.argument)){
            return getAstLiteralValue(returnNode.argument)
        }else if(t.isIdentifier(returnNode.argument)){
            return returnNode.argument.name
        }else{
            let code =  getAstNodeCode(returnNode)
            if(code.startsWith('return')) code =code.substring(6)
            if(code.endsWith(';')) code = code.substring(0,code.length-1)
            return code.trim()
        }   
    }
    get typeAnnotation(){
        return this._typeAnnotation ? getTypeAnnotation(this._typeAnnotation) : 'any'
    }
}
 
export class EaFunction extends EaObject<t.FunctionDeclaration>{
    private _arguments?:EaArguemnt[]      
    private _body?:EaBlockStatement
    private _declaration?:string    
    private _returns?:EaFunctionReturns      

    protected createAstNode(code:string){
        //return t.functionDeclaration(t.identifier(props.name||""),[],t.blockStatement([]),props.async,props.generator,props.arrow)
    }
    /**
     * 函数名称
     */
    get name(){
        return this.ast.id?.name
    }
    /**
     * 是否是异步函数
     */
    get async(){
        return this.ast.async
    }
    /**
     * 是否是生成器函数
     */
    get generator(){
        return this.ast.generator
    }
    /**
     * 是否是箭头函数
     */
    get arrow(){
        return false
    }
    get body(){
        return this._body || (this._body = new EaBlockStatement(this.ast.body,undefined))
    } 
    /**
     * 函数返回值
     */
    get returns(){
        if(!this._returns){
            const returnNode = this.body.ast.body.filter((node:t.Node)=>{
                return t.isReturnStatement(node)
            }) as t.ReturnStatement[]
            if(returnNode.length==0){
                this._returns = new EaFunctionReturns(t.returnStatement(),this.ast.returnType)
            }else{
                this._returns = new EaFunctionReturns(returnNode[0],this.ast.returnType)
            }            
        }
        return this._returns!        
    }
    /**
     * 函数参数
     */
    get arguments(){
        return (this._arguments || (this._arguments = this.ast.params.map((param)=>new EaArguemnt(param))))!
    } 
    toString(){
        if(!this._declaration){
            const node = t.cloneNode(this.ast,true,true)
            node.body = t.blockStatement([])
            this._declaration = getAstNodeCode(node) 
        }
        return this._declaration!
    }    
}



