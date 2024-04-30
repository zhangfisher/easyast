import * as t from '@babel/types';
import { getAstLiteralValue, getAstNodeCode, getAstNodeName, getTypeAnnotation } from './utils';
import { EaObject } from './base';


export interface FunctionArguemntType{
    type: 'Literal' | 'Expression' | 'RegExp' | 'Template' | 'Object' | 'Array' | 'Function' | 'Null' | 'Undefined' 
    value: any
    ast:t.Node
}

 

/**
 * 函数参数
 * 
 * 用于获取函数参数的名称和默认值
 * 
 * arg.name 获取参数名称
 * arg.defaultValue 获取参数默认值,默认值可能是
 *          
 * arg.loc 获取参数在源代码中的位置
 * arg.ast 获取参数的ast节点
 * 
 */
export class EaArguemnt extends EaObject<t.Node>{ 
    /**
     * 参数名称
     */
    get name(){
        const node = this.getArgumentNode()
        const name = getAstNodeName(node).trim()     
        return name.startsWith('...') ? name.substring(3) : name
    }
    /**
     * 该属性仅对类方法的参数有效
     * 
     * 因为在typescript中可以在构造参数中直接指定public private protected等
     * 
     */
    get accessibility(){
        return t.isTSParameterProperty(this.ast) ? this.ast.accessibility : null
    }
    /**
     * 是否是rest参数
     */
    get rest(){
        return t.isRestElement(this.ast)
    }    
    /**
     * 
     * typescript数据类型注解
     * 
     */
    get typeAnnotation(){
        //const typeAnnotation =  t.isIdentifier(this.ast.id) && this.ast.id.typeAnnotation ? this.ast.id.typeAnnotation : undefined
       // return getTsTypeAnnotation(typeAnnotation)
       if(t.isIdentifier(this.ast)){
           return getTypeAnnotation(this.ast.typeAnnotation!)
         }else if(t.isAssignmentPattern(this.ast)){
            if('typeAnnotation' in this.ast.left && this.ast.left.typeAnnotation){
                return getTypeAnnotation(this.ast.left.typeAnnotation)
            }else{
                return getTypeAnnotation(this.ast) 
            }           
        }else{
            return getTypeAnnotation(this.ast) 
        }
    }
    /**
     * 参数默认值
     * 由于参数的默认值可能是一个表达式或是一个非常复杂的结构，因此这里只返回一个简单的类型
     * 
     */
    get defaultValue(){
        const argNode = this.getArgumentNode()
        if(t.isAssignmentPattern(argNode)){
            if(t.isLiteral(argNode.right)){
                return getAstLiteralValue(argNode.right)
            }else{// 直接返回ast节点
                return getAstNodeCode(argNode.right)
            }
        }else{
            return undefined
        }         
    }
    private getArgumentNode(){
        if(t.isTSParameterProperty(this.ast)){
            return this.ast.parameter
        }else{
            return this.ast
        }
        
    }
}
