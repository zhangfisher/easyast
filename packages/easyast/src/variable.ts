import  generate from '@babel/generator';
import * as t from '@babel/types';  
import { EaObject } from './base'; 
import { getTypeAnnotation } from './utils';
import {  createExpressionObject } from './expression';
import { createLiteralObject } from './literal';
import { createLValObject } from './lval';

export class EaVariableList extends EaObject<t.VariableDeclaration> {
    get kind(){
        return this.ast.kind
    }
    get declarations(){
        return this.ast.declarations
    }
    toString(){
        return generate(this.ast).code
    }
    get items(){
        return this.ast.declarations.map(item=>createVariableObject(item,this))
    }
}

export class EaVariable extends EaObject<t.VariableDeclarator> {
    [x: string]: any; 
    private _declaration?:string            
    get name(){
        return t.isIdentifier(this.ast.id) ? this.ast.id.name : ''
    }
    get id(){
        return createLValObject(this.ast.id,this.parent)
    }
    /**
     * 变量的数据类型
     * 即typescript类型
     */
    get typeAnnotation(){
        const typeAnnotation = t.isIdentifier(this.ast.id) && this.ast.id.typeAnnotation ? this.ast.id.typeAnnotation : undefined
        return getTypeAnnotation(typeAnnotation)
    }
    get value(){
        if(!this.ast.init) return undefined
        const initNode = this.ast.init
        if(t.isLiteral(initNode)){
            if('value' in initNode) return initNode.value
            return createLiteralObject(initNode, this.parent?.ast)
        }else if(t.isExpression(initNode)){
            return createExpressionObject(initNode, this.parent)
        }else{
            return generate(initNode).code
        }    
    }
    /**
     * 值类型，针对typescript
     */
    get tsType(){
        if(!this.ast.init) return undefined
        return this.ast.init.type
    }
    /**
     * 变量声明方式：var let const
     */
    get kind(){
        return this.parent && (this.parent.ast as t.VariableDeclaration).kind
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



export function createVariableObject(node:t.VariableDeclarator,parent?:EaObject){    
    return new EaVariable(node,parent)
}

// type LVal = Identifier | MemberExpression | RestElement | AssignmentPattern | ArrayPattern | ObjectPattern | TSParameterProperty | TSAsExpression | TSSatisfiesExpression | TSTypeAssertion | TSNonNullExpression;