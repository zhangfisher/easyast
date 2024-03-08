import * as t from '@babel/types';


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
export function getAstNodeName(node: t.Node): string | undefined{
    if (t.isIdentifier(node)) {
        return node.name;
    }else if (t.isFunctionDeclaration(node)) {
        return node.id?.name || '';
    }else if (t.isVariableDeclarator(node)) {
        //return getAstNodeName(node.id);
    }else if(t.isRestElement(node)){
        return getAstNodeName(node.argument)
    }else if(t.isAssignmentPattern(node)){
        return getAstNodeName(node.left)
    }      
}