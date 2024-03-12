import * as t from '@babel/types';
import { FlexIterator } from './utils';
import { EaArguemnt } from './arguemnt';
import { EaObject, IEaObject } from './base';
import { EaStatement } from './statement';
import  generate from '@babel/generator';

/**
 * 创建一个函数对象
 * 
 * - 传入一个FunctionDeclaration节点对象
 * new EaFunction(t.FunctionDeclaration)
 * - 传入一个节点对象 
 * new EaFunction({
 *    name:"函数名称",
 *    async:true,
 *    generator:true,
 *    args:[EaArguemnt,EaArguemnt] 
 * })
 * 
 */
export interface EaFunctionProps extends IEaObject{
    name?:string
    async?:boolean
    generator?:boolean    
    arrow?:boolean
    args?:EaArguemnt[]
    code?:string            // 函数代码
}

 
export class EaFunction extends EaObject<t.FunctionDeclaration , EaFunctionProps>{
    private _arguments?:EaArguemnt[]      
    private _body?:EaStatement
    private _declaration?:string          

    protected createAstNode(props:EaFunctionProps){
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
        return this._body || (this._body = new EaStatement(this.ast.body,undefined))
    }
    /**
     * 函数返回值
     */
    get returns(){
        const returnNode = this.body.ast.body.filter((node:t.Node)=>{
            return t.isReturnStatement(node)
        })
        if(returnNode.length==0) return undefined
        return generate(returnNode[0],{compact:true}).code.substring(6)
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
            this._declaration = generate(node).code
        }
        return this._declaration!
    }    
}



