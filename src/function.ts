import * as t from '@babel/types';
import { AstNodeIterator, getAstNodeName } from './utils';
import { EaArguemnt } from './arguemnt';


export class EaFunction{
    private _ast?:t.FunctionDeclaration
    private _args:AstNodeIterator<EaArguemnt,t.Identifier | t.RestElement | t.Pattern> | undefined
    constructor(node:t.Node){
        if(node.type !== "FunctionDeclaration"){
            throw new Error("Function must be FunctionDeclaration")
        }
        this._ast = node
    }
    get ast(){return this._ast!}
    /**
    * 函数体在源代码中的位置
    */
    get loc(){
        return this.ast.loc
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
     * 函数参数
     */
    get args(){
        if(!this._args){
            this._args = new AstNodeIterator<EaArguemnt,t.Identifier | t.RestElement | t.Pattern>(this.ast.params,(param)=>{
                return new EaArguemnt(param)
            })
        }
        return this._args!
    }
}