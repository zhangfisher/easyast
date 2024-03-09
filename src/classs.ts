/**
 *
 *  变量 
 *
 *  
 */

import * as t from '@babel/types';  
import { EaObject,EaObjectProps } from './base';
import { getAstLiteralValue } from './utils';
import generate from '@babel/generator';

export interface EaClassProps extends EaObjectProps{ 
}
export class EaClass extends EaObject<t.VariableDeclarator,EaClassProps>{
    private _varDescr?:string            
    get name(){
        return t.isIdentifier(this.ast.id) ? this.ast.id.name : ''
    }
    /**
     * 变量的数据类型
     * 即typescript类型
     */
    get dataType(){
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
    get kind(){
        return this.parent && (this.parent as t.VariableDeclaration).kind 
    } 
    toString(){
        if(!this._varDescr){
            const node =t.cloneNode(this.ast,false,true)
            if(node.init){
                if(t.isArrowFunctionExpression(node.init)){
                    node.init.body = t.blockStatement([])
                }else if(t.isFunctionExpression(node.init)){
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

