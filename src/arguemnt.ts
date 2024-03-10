import * as t from '@babel/types';
import { getAstNodeName } from './utils';


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
export class EaArguemnt{
    constructor(public ast:t.Identifier | t.RestElement | t.Pattern |  t.TSParameterProperty){
        
    }
    /**
     * 参数名称
     */
    get name(){
        return getAstNodeName(this.ast)
    }
    get loc(){
        return this.ast.loc
    }
    /**
     * typescript数据类型
     */
    get datatype(){
        return ""
    }
    /**
     * 参数默认值
     * 由于参数的默认值可能是一个表达式或是一个非常复杂的结构，因此这里只返回一个简单的类型
     * 
     */
    get defaultValue(){
        if(t.isAssignmentPattern(this.ast)){
            if(t.isNullLiteral(this.ast.right)){
                return null
            }else if(t.isRegExpLiteral(this.ast.right)){
                return this.ast.right
            }else if(t.isTemplateLiteral(this.ast.right)){
                return this.ast.right
            }else if(t.isLiteral(this.ast.right)){
                return this.ast.right.value
            }else{// 直接返回ast节点
                return this.ast.right
            }
        }else{
            return undefined
        }         
    }
}
