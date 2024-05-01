import * as t from '@babel/types';
import { FlexIterator } from './utils';
import { EaFunction } from './function';
import { EaVariable, EaVariableList } from './variable';
import { EaObject, } from './base';
import { EaClass } from './classs';
import {  EaExpression,createExpressionObject } from './expression'; 
import { EaIdentifier } from './identifier';
import { EaPattern } from './pattern';

export interface IEaStatement extends EaObject{}

export class EaBlockStatement extends EaObject<t.BlockStatement>{
    private _functions:EaFunction[] = []
    private _variables:EaVariableList[] = [] 
    private _statements:EaObject[] = []
    private _classs:EaClass[]  = []    
    private _expressions:(EaExpression|EaIdentifier)[] =[]
    // 保存按顺序遍历的对象
    private _objects:EaObject[] = []
    protected _parsed:boolean = false

    /**
     * 语句类型,如DoWhileStatement
     */
    get type(){
        return this.ast.type
    }
    get functions(){
        if(!this._parsed) this.parse()
        return this._functions        
    }
    get variables(){
        if(!this._parsed) this.parse()
        return this._variables        
    }
    get statements(){
        if(!this._parsed) this.parse()
        return this._statements        
    }
    get classs(){
        if(!this._parsed) this.parse()
        return this._classs        
    }
    get objects(){
        if(!this._parsed) this.parse()
        return this._objects        
    }
    
    get expressions(){
        if(!this._parsed) this.parse()
        return this._expressions        
    }

    get body(){
        if('body' in this.ast){
            return this.ast.body
        }
    }

    /**
     * 遍历所有节点生成functions,variables,class等对象
     */
    parse(){
        this._functions=[]
        this._variables=[]
        this._statements=[]
        this._classs =[]      
        this._objects = [...this.getIterator()]
        this._parsed = true
    }
    /**
     * 返回this.objects的可迭代对象
     * @returns 
     */
    [Symbol.iterator](): Iterator<EaObject>{
        if(!this._parsed) this.parse()
        return this.objects[Symbol.iterator]()
    }
    /**
     * 按顺序遍历所有节点，返回对象列表
     * @returns 
     */
    getIterator(){
        if(!('body' in this.ast)) return []
        return (new FlexIterator<any,any,any>(this.ast.body,{
            pick:(node)=>{
                if(t.isExportNamedDeclaration(node)){
                    const declaration = (node as t.ExportNamedDeclaration).declaration
                    if(declaration){
                        if(t.isVariableDeclaration(declaration)){
                            const declarations = (declaration as t.VariableDeclaration).declarations
                            declarations.forEach((node)=>{
                                // @ts-ignore
                                node._easyAstMeta = {exported :true}
                            })
                            return declarations
                        }else{
                            return declaration
                        }                    
                    }else {
                        return node
                    }                    
                }else if(t.isVariableDeclaration(node)){
                    return node.declarations
                }else if(t.isExportAllDeclaration(node)){                    
                    return node
                }else if(t.isExportDefaultDeclaration(node)){
                    return node.declaration
                }else if(t.isExportNamespaceSpecifier(node)){
                    return node
                }else if(t.isExportSpecifier(node)){
                    return node
                }else if(t.isExportDeclaration(node)){
                    return node
                }else if(t.isImportDeclaration(node)){
                    return node
                }else if(t.isStatement(node)){
                    if(t.isExpressionStatement(node)){
                        if(t.isExpression(node.expression)){
                            return node.expression
                        }else{
                            return node
                        }                        
                    }else{
                        return node
                    }
                }else{
                    return node
                }               
            },
            transform:(node:t.Node,parent:EaObject)=>{
                let eaObject
                if(t.isFunctionDeclaration(node)){
                    eaObject = new EaFunction(node,this)
                    this._functions.push(eaObject)
                }else if(t.isVariableDeclarator(node)){
                    eaObject = new EaVariable(node,parent)
                    this._variables.push(eaObject)
                }else if(t.isClassDeclaration(node)){
                    eaObject = new EaClass(node,this)
                    this._classs.push(eaObject)
                }else if(t.isExpression(node)){
                    eaObject = this.createExpressionObject(node,parent)
                    this._expressions.push(eaObject as EaExpression)                        
                        
                }else if(t.isStatement(node)){
                    eaObject = createStatementObject(node,parent)
                    this._statements.push(eaObject)                    
                }else{                    
                    eaObject = this.createEaObject(node)
                }  
                return eaObject
            },
            recursion:true
        }))
    } 
    createExpressionObject(node:t.Expression,parent:EaObject){
        if(!parent) parent = this
        return createExpressionObject(node,parent)
        
    }
    /**
     * 供子类重写，用于创建EaObject对象
     * @param node 
     * @returns 
     */
    createEaObject(node:t.Node):EaObject | undefined{
        return new EaObject(node,this)
    }
}



export class EaIfStatement extends EaObject<t.IfStatement>{
    private _else?:EaBlockStatement
    get condition(){
        return createExpressionObject(this.ast.test)
    }
    get if(){
        return new EaBlockStatement(this.ast.consequent as t.BlockStatement,this)
    }
    get else(){
        if(!this._else) this.elseIf
        return this._else
    }
    get elseIf():{condition:EaExpression,body:EaBlockStatement}[]{
        const ifStatements:{condition:EaExpression,body:EaBlockStatement}[] = []
        let node = this.ast.alternate
        if(node){
            while(t.isIfStatement(node)){
                ifStatements.push({
                    condition:createExpressionObject(node.test) as EaExpression,
                    body:new EaBlockStatement(node.consequent as t.BlockStatement,this)
                })
                node = node.alternate
            } 
            this._else = new EaBlockStatement(node as t.Statement as t.BlockStatement,this)
        }
        
        return ifStatements
    }
}

export class EaForStatement extends EaObject<t.ForStatement>{
    get init(){
        if(this.ast.init){
            if(t.isVariableDeclaration(this.ast.init)){
                return this.ast.init.declarations.map(v=>new EaVariable(v,this))
            }else{
                return createExpressionObject(this.ast.init)
            }
        }        
    }
    get condition(){
        if(this.ast.test){
            return createExpressionObject(this.ast.test)
        }        
    }
    get update(){
        if(this.ast.update){
            return createExpressionObject(this.ast.update)
        }        
    }
    get body(){
        return new EaBlockStatement(this.ast.body as t.BlockStatement,this)
    }
}

export class EaForOfStatement extends EaObject<t.ForOfStatement>{
    get left(){
        if(this.ast.left){
            if(t.isVariableDeclaration(this.ast.left)){
                return this.ast.left.declarations.map(declarator=>new EaVariable(declarator,this))
            }else{
                return new EaObject(this.ast.left,this)
            }            
        }        
    }
    get right(){
        return createExpressionObject(this.ast.right)
    }
    get body(){
        return new EaBlockStatement(this.ast.body as t.BlockStatement,this)
    }
}
export class EaForInStatement extends EaObject<t.ForInStatement>{
    get left(){
        if(this.ast.left){
            if(t.isVariableDeclaration(this.ast.left)){
                return this.ast.left.declarations.map(declarator=>new EaVariable(declarator,this))
            }else{
                return new EaObject(this.ast.left,this)
            }            
        }        
    }
    get right(){
        return createExpressionObject(this.ast.right)
    }
    get body(){
        return new EaBlockStatement(this.ast.body as t.BlockStatement,this)
    }

}
export class EaBreakStatement extends EaObject<t.BreakStatement>{
    get label(){
        return this.ast.label
    }
}
export class EaContinueStatement extends EaObject<t.ContinueStatement>{
    get label(){
        return this.ast.label
    }
}
export class EaReturnStatement extends EaObject<t.ReturnStatement>{
    get argument(){
        if(this.ast.argument){
            return createExpressionObject(this.ast.argument)
        }
    }
}

export class EaWithStatement extends EaObject<t.WithStatement>{
    get object(){
        return createExpressionObject(this.ast.object)
    }
    get body(){
        return new EaBlockStatement(this.ast.body as t.BlockStatement,this)
    }
}
export class EaSwitchStatement extends EaObject<t.SwitchStatement>{
    get discriminant(){
        return createExpressionObject(this.ast.discriminant)
    }
    get cases(){
        return this.ast.cases.map(node=>new EaSwitchCase(node,this))
    }
}
export class EaSwitchCase extends EaObject<t.SwitchCase>{
    get test(){
        if(this.ast.test){
            return createExpressionObject(this.ast.test)
        }
    }
    get consequent(){
        return this.ast.consequent.map(node=>createStatementObject(node,this))
    }
}

export class EaThrowStatement extends EaObject<t.ThrowStatement>{
    get argument(){
        return createExpressionObject(this.ast.argument)
    }
}
export class EaCatchClause extends EaObject<t.CatchClause>{
    get param(){
        if(this.ast.param){
            return new EaPattern(this.ast.param,this)
        }        
    }
    get body(){
        return new EaBlockStatement(this.ast.body,this)
    }
}

export class EaTryStatement extends EaObject<t.TryStatement>{
    get try(){
        return new EaBlockStatement(this.ast.block,this)
    }
    get catch(){
        if(this.ast.handler){
            return new EaCatchClause(this.ast.handler,this)
        }
    }
    get finally(){
        if(this.ast.finalizer){
            return new EaBlockStatement(this.ast.finalizer,this)
        }
    }
}
 
export class EaDebuggerStatement extends EaObject<t.DebuggerStatement>{
    
}


export function createStatementObject(node:t.Statement,parent?:EaObject){
    if(t.isIfStatement(node)){
        return new EaIfStatement(node,parent)
    }else if(t.isForStatement(node)){
        return new EaForStatement(node,parent)
    }else if(t.isForOfStatement(node)){
        return new EaForOfStatement(node,parent)
    }else if(t.isForInStatement(node)){
        return new EaForInStatement(node,parent)
    }else if(t.isBreakStatement(node)){
        return new EaBreakStatement(node,parent)
    }else if(t.isContinueStatement(node)){
        return new EaContinueStatement(node,parent)
    }else if(t.isReturnStatement(node)){
        return new EaReturnStatement(node,parent)
    }else if(t.isWithStatement(node)){
        return new EaWithStatement(node,parent)
    }else if(t.isSwitchStatement(node)){
        return new EaSwitchStatement(node,parent)
    }else if(t.isDebuggerStatement(node)){
        return new EaDebuggerStatement(node,parent)
    }else if(t.isThrowStatement(node)){
        return new EaThrowStatement(node,parent)
    }else{
        return new EaBlockStatement(node as t.BlockStatement,parent)
    }
}