import * as t from '@babel/types';
import { FlexIterator } from './utils';
import { EaFunction } from './function';
import { EaVariable } from './variable';
import { EaObject, IEaObjectProps } from './base';
import { EaClass } from './classs';
import { EaExpression } from './expression';
import { EaExport } from './exports'; 
import { EaImport } from './imports';

export interface IEaStatement extends EaObject{}

export class EaStatement<Node extends t.Node=t.Node,Props extends IEaObjectProps = IEaObjectProps> extends EaObject<t.Program>{
    functions:EaFunction[] = []
    variables:EaVariable[] = []
    statements:EaObject[] = []
    classs:EaClass[]  = []              
    // 保存按顺序遍历的对象
    objects:EaObject[] = []
    constructor(node:Node | Props,parentNode?:t.Node){
        super(node,parentNode)
        this.parse()
    }
    get sourceType(){
        return this.ast.sourceType
    } 
    /**
     * 遍历所有节点生成functions,variables,class等对象
     */
    parse(){
        this.functions=[]
        this.variables=[]
        this.statements=[]
        this.classs =[]        
        this.objects=[]
        this.objects = [...this.getIterator()]
    }
    /**
     * 返回this.objects的可迭代对象
     * @returns 
     */
    [Symbol.iterator](): Iterator<EaObject>{
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
                }else{
                    return node
                }               
            },
            transform:(node:t.Node)=>{
                let eaObject
                if(t.isFunctionDeclaration(node)){
                    eaObject = new EaFunction(node,this.ast)
                    this.functions.push(eaObject)
                }else if(t.isVariableDeclarator(node)){
                    eaObject = new EaVariable(node,this.ast)
                    this.variables.push(eaObject)
                }else if(t.isClassDeclaration(node)){
                    eaObject = new EaClass(node,this.ast)
                    this.classs.push(eaObject)
                }else if(t.isExpression(node)){
                    eaObject = new EaExpression(node,this.ast)
                }else if(t.isBlockStatement(node)){
                    eaObject = new EaStatement(node,this.ast)
                    this.statements.push(eaObject)
                }else{                    
                    eaObject = this.createEaObject(node)
                } 
                return eaObject
            },
            recursion:true
        }))
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

