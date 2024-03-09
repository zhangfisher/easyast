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


/**
 * 获取一个字面量的值
 *  
 * 
 * 
 * @param node 
 * @returns 
 */
export function getAstLiteralValue(node: t.Literal): any {
    if (t.isNullLiteral(node)) {
        return null
    }else if(t.isRegExpLiteral(node)){
        return new RegExp(node.pattern,node.flags)
    }else if(t.isTemplateLiteral(node)){
        return node.quasis.map((item)=>item.value.raw).join('')
    }else{
        return node.value
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

export function canIterator(obj:any){
    return typeof(obj)=='object' && typeof obj[Symbol.iterator] === 'function'
}

export type FlexIteratorOptions<Value=any,Result=Value,Parent=any> = {
    pick?:(item:Value | Parent)=>Value | Iterable<any>
    transform:(value:Value,parent?:Parent)=>Result
    // 当true时如果transform也返回一个迭代对象时，递归遍历所有可迭代对象
    recursion?:boolean

}
 
/**
 * 可以迭代的对象
 * 
 * const source = new FlexIterator([1,2,3,4,5])
 * for(let value of source){
 *  console.log(value)
 * }
 * Output: 1,2,3,4,5
 * 
 * const source = new FlexIterator([1,2,3,4,5],{transform:(value)=>`S-${value}`})
 * for(let value of source){
 *  console.log(value)
 * }
 * Output: S-1,S-2,S-3,S-4,S-5
 * 
 * const source = new FlexIterator([1,2,[3,4],[5,6,[7,8,[9,10]]]],{
 *  transform:(value)=>`S-${value}`
 *  recursion:true
 * })
 * for(let value of source){
 *  console.log(value) * 
 * }
 * Output: S-1,S-2,S-3,S-4,S-5,S-6,S-7,S-8,S-9,S-10
 * 
 * 
 * 
 * @types 
 *  S: 源类型
 *  R: 返回值类型
 *  P: 当前节点的父节点类型，当
 * @param nodes 
 * @param options 
 */
export class FlexIterator<Value=any,Result=Value,Parent=Value> {
    options: FlexIteratorOptions<Value,Result,Parent>
    constructor(private nodes: Iterable<Value | Iterable<any>>,options?:FlexIteratorOptions<Value,Result,Parent>) {
        this.options = Object.assign({},options)
    }  
    [Symbol.iterator](): Iterator<Result, any, undefined> {
        let value : any
        const {pick,transform,recursion} = this.options
        const transformValue = typeof(transform)=='function' ? (value:any,parent?:Parent)=>transform(value,parent) : (value:any,parent?:Parent)=>value
        const pickItemValue = typeof(pick) == 'function' ? (value:Value | Parent)=>pick(value) : (value:any)=>value
        let sources:Iterator<any>[] = [this.nodes[Symbol.iterator]()]  
        let curSource = sources[sources.length-1] as Iterator<Result, any, undefined> 
        let parentValue:Value | Iterable<any> | undefined 
        return {
            next() {                
                value =  curSource.next()
                if(value.done){
                    sources.pop()
                    if(sources.length>0){
                        curSource = sources[sources.length-1]    
                        return this.next()          
                    }else{
                        return {done: true, value: undefined} 
                    }                    
                }else{
                    const itemValue = pickItemValue(value.value)
                    if(recursion && canIterator(itemValue)){
                        sources.push(itemValue[Symbol.iterator]())
                        curSource = sources[sources.length-1]    
                        parentValue = value.value
                        return this.next() 
                    }else{                                           
                        return {done:false,value:transformValue(itemValue,parentValue as any)}
                    }
               }
            },
            return() {
                return {done: true, value: undefined};
            }
        
        }
    }
    
}
 
 