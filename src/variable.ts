import  generate from '@babel/generator';
import * as t from '@babel/types';  
import { EaObject,IEaObjectProps } from './base'; 
import { getTypeAnnotation } from './utils';
import { EaExpression } from './expression';

export interface IEaVariable extends IEaObjectProps{
    name:string
    typeAnnotation:string
    value:any
    kind:t.VariableDeclaration['kind'] | undefined
}
export class EaVariable extends EaObject<t.VariableDeclarator,IEaVariable> implements IEaVariable{
    [x: string]: any; 
    private _declaration?:string            
    get name(){
        return t.isIdentifier(this.ast.id) ? this.ast.id.name : ''
    }
    /**
     * 变量的数据类型
     * 即typescript类型
     */
    get typeAnnotation(){
        const typeAnnotation =  t.isIdentifier(this.ast.id) && this.ast.id.typeAnnotation ? this.ast.id.typeAnnotation : undefined
        return getTypeAnnotation(typeAnnotation)
    }
    get value(){
        if(!this.ast.init) return undefined
        const initNode = this.ast.init
        if(t.isBooleanLiteral(initNode)){
            return initNode.value
        }else if(t.isStringLiteral(initNode)){
            return initNode.value
        }else if(t.isNumericLiteral(initNode)){
            return initNode.value
        }else if(t.isExpression(initNode)){
            return new EaExpression(initNode)
        }else{
            return generate(initNode,{compact:true}).code
        }        
    }
    /**
     * 值类型，针对typescript
     */
    get valueType(){
        if(!this.ast.init) return undefined
        return this.ast.init.type
    }
    /**
     * 变量声明方式：var let const
     */
    get kind(){
        return this.parentAst && (this.parentAst as t.VariableDeclaration).kind
    } 
    toString(){
        if(!this._declaration){
            const node =t.cloneNode(this.ast,true,true)
            if(node.init){
                if(t.isArrowFunctionExpression(node.init) || t.isFunctionExpression(node.init) ){
                    node.init.body = t.blockStatement([])
                }else if(t.isTemplateLiteral(node.init)){
                    // 模板字符串有可能很大，不得于呈现
                }
            }
            this._declaration = generate(node).code
        }
        return this._declaration!
    }
}

