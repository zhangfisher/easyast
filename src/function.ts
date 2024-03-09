import * as t from '@babel/types';
import { FlexIterator, getAstNodeName } from './utils';
import { EaArguemnt } from './arguemnt';
import { EaObject, EaObjectProps } from './base';
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
export interface EaFunctionProps extends EaObjectProps{
    name?:string
    async?:boolean
    generator?:boolean    
    arrow?:boolean
    args?:EaArguemnt[]
    code?:string            // 函数代码
}

export class EaFunction extends EaObject<t.FunctionDeclaration , EaFunctionProps>{
    private _args?:FlexIterator<t.Identifier | t.RestElement | t.Pattern,EaArguemnt>      
    private _body?:EaStatement
    private _funcDescr?:string          // 函数描述，不包含函数体
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
        if(!this._body){
            this._body = new EaStatement(this.ast.body,undefined)
        }
        return this._body
    }
    /**
     * 函数返回值
     */
    get returns(){
        return this.body.body.filter((node:t.Node)=>{
            return t.isReturnStatement(node)
        })
    }
    /**
     * 函数参数
     */
    get args(){
        if(!this._args){
            this._args = new FlexIterator<t.Identifier | t.RestElement | t.Pattern,EaArguemnt>(this.ast.params,{
                transform:(param)=>{
                    return new EaArguemnt(param)
                }
            })
        }
        return this._args!
    }
    private getArgNames(){
        return this.ast.params.map((param)=>getAstNodeName(param))
    
    }
    toString(){
        if(!this._funcDescr){
            const node = t.cloneNode(this.ast,false,true)
            node.body = t.blockStatement([])
            this._funcDescr = generate(node).code
        }
        return this._funcDescr!
    }
    
}