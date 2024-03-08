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

export class AstNodeIterator<T=t.Node,N=t.Node> {
    constructor(private nodes: any[],private transform:(node:N)=>T) {
    }  
    [Symbol.iterator](): Iterator<T, any, undefined> {
        const self = this
        let index = 0
        let value :T
        return {
            next() {                
                if (index < self.nodes.length) {
                    value =  self.transform(self.nodes[index]);
                    index++;
                    return {done: false, value: value};
                }
                return {done: true, value: undefined} 
            },
            return() {
                index=0;
                return {done: true, value: undefined};
            }
        
        }
    }
    
}


/**
 * 
 * new AstNodeMergeIterator([1,2,[1,2,3],3],(node)=>{
 * 
 * })
 * 
 * [1,2,1,2,3,4]
 * 
 */
export class AstNodeMergeIterator<T=t.Node,N=t.Node> {
    constructor(private nodes: any[],private transform:(node:N)=>T) {
    }  
    [Symbol.iterator](): Iterator<T, any, undefined> {
        const self = this
        let index = 0
        let value :T
        return {
            next() {                
                if (index < self.nodes.length) {
                    value =  self.transform(self.nodes[index]);
                    index++;
                    return {done: false, value: value};
                }
                return {done: true, value: undefined} 
            },
            return() {
                index=0;
                return {done: true, value: undefined};
            }
        
        }
    }
    
}