/**
 *
 *  变量 
 *
 *  
 */

import * as t from '@babel/types';  
import { EaObject,IEaObject } from './base';
import { getAstLiteralValue } from './utils';
import generate from '@babel/generator';

export interface IEaVariable extends IEaObject{
    name:string
    datatype:string
    value:any
    kind:t.VariableDeclaration['kind'] | undefined
}
export class EaVariable extends EaObject<t.VariableDeclarator,IEaVariable> implements IEaVariable{
    [x: string]: any; 
    private _varDescr?:string           // 变量声明，如果有函数
    get name(){
        return t.isIdentifier(this.ast.id) ? this.ast.id.name : ''
    }
    /**
     * 变量的数据类型
     * 即typescript类型
     */
    get datatype(){
        return ""
    }
    get value(){
        if(!this.ast.init) return undefined
        return generate(this.ast.init,{}).code 
    }
    /**
     * 值类型
     */
    get valueType(){
        if(!this.ast.init) return undefined
        return this.ast.init.type
    }
    /**
     * 变量声明方式：var let const
     */
    get kind(){
        return this.parent && (this.parent as t.VariableDeclaration).kind
    } 
    toString(){
        if(!this._varDescr){
            const node =t.cloneNode(this.ast,false,true)
            if(node.init){
                if(t.isArrowFunctionExpression(node.init) || t.isFunctionExpression(node.init) ){
                    node.init.body = t.blockStatement([])
                }else if(t.isTemplateLiteral(node.init)){
                    // 模板字符串有可能很大，不得于呈现
                }
            }
            this._varDescr = generate(node).code
        }
        return this._varDescr!
    }
}

