import generate, { GeneratorOptions } from '@babel/generator';
import * as t from '@babel/types';
import { EaObject } from './base';
import { createVariableObject } from './variable';
import { EaClass } from './classs';
import { createStatementObject } from './statement';
import { createExpressionObject } from './expression';
import { createLValObject } from './lval';


export function getEaObject(node:t.Node,parentObject?:EaObject){    
    if(t.isVariableDeclarator(node)){
        return createVariableObject(node,parentObject)
    }else if(t.isClassDeclaration(node)){
        return new EaClass(node,parentObject)
    }else if(t.isExpression(node)){
        return createExpressionObject(node,parentObject)
    }else if(t.isLVal(node)){
        return createLValObject(node,parentObject)
    }else if(t.isStatement(node)){
        return createStatementObject(node,parentObject)
    }else{
        return new EaObject(node)
    }    
}

/**
 * 获取节点名称
 * 
 * 注意有些节点没有名称
 * 
 * 此函数用在获取函数名称时调用
 * 
 * @param node 
 * @returns 
 */
export function getAstNodeName(node: t.Node): string {
    if (t.isIdentifier(node)) {
        return node.name;
    }else if (t.isFunctionDeclaration(node)) {
        return node.id?.name || '';
    }else if (t.isVariableDeclarator(node)) {
        //return getAstNodeName(node.id);
    }else if(t.isRestElement(node)){
        return `...${getAstNodeName(node.argument)}`
    }else if(t.isAssignmentPattern(node)){
        return getAstNodeName(node.left)
    }      
    return ''
}

/**
 * 获取节点的代码
 * 
 * @param node 
 * @returns 
 */

export function getAstNodeCode(node: t.Node,options?:GeneratorOptions): string {
    return generate(node,Object.assign({ compact: true },options)).code.trim();
}
/**
 * 获取一个字面量的值
 *  
 * 
 * 
 * @param node 
 * @returns 
 */
export function getAstLiteralValue(node: t.Literal): any {
    try{
        if (t.isNullLiteral(node)) {
            return null
        }else if(t.isRegExpLiteral(node)){
            return (new RegExp(node.pattern,node.flags)).toString()
        }else if('value' in node){
            return node.value
        }else if(t.isTemplateLiteral(node)){
            return node.quasis.map((item)=>item.value.raw).join('')
        }else{ 
            return getAstNodeCode(node)
        }    
    }catch{
        return getAstNodeCode(node)
    }    
}
/**
 * 
 * type LVal = Identifier | MemberExpression | RestElement | AssignmentPattern 
 * ArrayPattern | ObjectPattern | TSParameterProperty | TSAsExpression | TSSatisfiesExpression | TSTypeAssertion | TSNonNullExpression;

 * @param node 
 * @returns 
 */
export function getAstIdName(node: t.LVal): string {
    if(t.isIdentifier(node)){
        return node.name
    }else if(t.isAssignmentPattern(node)){
        return getAstIdName(node.left)
    }else if(t.isRestElement(node)){
        return `...${getAstIdName(node.argument)}`
    }else{
        return ''    
    }

}
 
 
/**
 * 读取节点的类型注解
 * @param node 
 * @returns 
 */
export function getTypeAnnotation(node?:t.Node){
    if(!node) return ''
    try{
        if('typeAnnotation' in node){
            const t = getAstNodeCode(node.typeAnnotation!,{compact:false})
            return t.replace(/^:\s*/g,'').trim()
        }else{
            return ''
        }        
    }catch{
        return ''
    } 
}



export function isEsmModule(code:string){
    const esmPattern = /import\s+.*\s+from\s+['"].*['"]|export\s+.*|export\s+{\s*.*\s*}\s+from\s+['"].*['"]/;
    return esmPattern.test(code); 
}


export function getRandId(){
    return Math.random().toString(36).slice(2)
} 
