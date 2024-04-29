import * as t from '@babel/types';
import { FlexIterator } from './utils';
import { EaFunction } from './function';
import { EaVariable } from './variable';
import { EaObject, IEaObjectProps } from './base';
import { EaClass } from './classs';
import { EaArrayExpression, EaAssignmentExpression, EaAwaitExpression, EaBinaryExpression, EaConditionalExpression, EaExpression, EaLogicalExpression, EaMemberExpression, EaNewExpression, EaYieldExpression } from './expression'; 

export interface IEaStatement extends EaObject{}

export class EaStatement<Node extends t.Node=t.Node,Props extends IEaObjectProps = IEaObjectProps> extends EaObject<t.Program>{
    private _functions:EaFunction[] = []
    private _variables:EaVariable[] = []
    private _statements:EaObject[] = []
    private _classs:EaClass[]  = []    
    private _expressions:EaExpression[] =[]
    // 保存按顺序遍历的对象
    private _objects:EaObject[] = []
    protected _parsed:boolean = false
    constructor(node:Node | Props,parentNode?:t.Node){
        super(node,parentNode)        
    }
    get sourceType(){
        return this.ast.sourceType
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
                    }
                }else{
                    return node
                }               
            },
            transform:(node:t.Node,parent:t.Node)=>{
                let eaObject
                if(t.isFunctionDeclaration(node)){
                    eaObject = new EaFunction(node,this.ast)
                    this._functions.push(eaObject)
                }else if(t.isVariableDeclarator(node)){
                    eaObject = new EaVariable(node,parent)
                    this._variables.push(eaObject)
                }else if(t.isClassDeclaration(node)){
                    eaObject = new EaClass(node,this.ast)
                    this._classs.push(eaObject)
                }else if(t.isExpression(node)){
                    eaObject = this.createExpressionObject(node,parent)
                    this._expressions.push(eaObject)                        
                        
                }else if(t.isStatement(node)){
                        eaObject = new EaStatement(node,this.ast)
                        this._statements.push(eaObject)
                }else{                    
                    eaObject = this.createEaObject(node)
                }  
                return eaObject
            },
            recursion:true
        }))
    } 

    createExpressionObject(node:t.Expression,parent:t.Node){
        if(t.isBinaryExpression(node)){
            return new EaBinaryExpression(node,parent)
        }else if(t.isAssignmentExpression(node)){
            return new EaAssignmentExpression(node,parent)
        }else if(t.isMemberExpression(node)){
            return new EaMemberExpression(node,parent)
        }else if(t.isArrayExpression(node)){
            return new EaArrayExpression(node,parent)
        }else if(t.isAwaitExpression(node)){
            return new EaAwaitExpression(node,parent)
        }else if(t.isConditionalExpression(node)){
            return new EaConditionalExpression(node,parent)
        }else if(t.isNewExpression(node)){
            return new EaNewExpression(node,parent)
        }else if(t.isYieldExpression(node)){
            return new EaYieldExpression(node,parent)
        }else if(t.isLogicalExpression(node)){
            return new EaLogicalExpression(node,parent)
        }else{
            return new EaExpression(node,parent)
        }
        
    }
    /**
     * 供子类重写，用于创建EaObject对象
     * @param node 
     * @returns 
     */
    createEaObject(node:t.Node):EaObject | undefined{
        return new EaObject(node,this.ast)
    }
}

