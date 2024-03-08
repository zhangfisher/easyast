import * as t from '@babel/types';
import { getAstNodeName } from './utils';
import { Arguemnt } from './arguemnt';


export class Function{
    private _ast?:t.FunctionDeclaration
    private _args:Arguemnt[] = []
    constructor(ast:t.Node){
        if(ast.type !== "FunctionDeclaration"){
            throw new Error("Function must be FunctionDeclaration")
        }
        this._ast = ast
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
            this.ast.params.map((param)=>{
                this._args.push(new Arguemnt(param))
            })
            return []
        }
        return this._args
    }
}