import  generate from '@babel/generator';
import * as t from '@babel/types';  
import { EaObject } from './base'; 
import { getTypeAnnotation } from './utils';
import {  createExpressionObject } from './expression';
import { createLiteralObject } from './literal';
import { createLValObject } from './lval';

export class EaVariableDeclaration extends EaObject<t.VariableDeclaration> {
    private _items:EaVariable[]=[]
    createAstNode(){
        return t.variableDeclaration(this.ast.kind,this.ast.declarations)
    }
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
        if(this._items.length==0){
            this._items = this.ast.declarations.map(item=>createVariableObject(item,this))
        }
        return this._items
    }
}

export class EaVariable extends EaObject<t.VariableDeclarator> {
    [x: string]: any; 
    private _declaration?:string          
    get name(){
        return t.isIdentifier(this.ast.id) ? this.ast.id.name : ''
    }
    set name(value:string){
        if(t.isIdentifier(this.ast.id)){
            this.ast.id.name = value
        }else{
            throw new Error('Only Identifier can set name')
        }
    }
    get id(){
        return createLValObject(this.ast.id,this)
    }
    /**
     * 当变量是解构赋值时，返回解构模式
     */
    get pattern(){
        if(t.isPattern(this.ast.id)){
            return createLValObject(this.ast.id,this)
        }
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
            return createLiteralObject(initNode, this.parent)
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
