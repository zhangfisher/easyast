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
    exports:EaExport[] = []             // 导出的对象
    imports:EaImport[] = []             // 导入的对象

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
        [...this]
    }
    /**
     * 按顺序遍历所有节点，返回对象列表
     * @returns 
     */
    [Symbol.iterator](): Iterator<EaObject>{
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
                }else if(t.isExportDeclaration(node)){
                    eaObject = new EaExport(node,this.ast)
                    this.exports.push(eaObject)
                }else if(t.isImportDeclaration(node)){
                    eaObject = new EaImport(node,this.ast)
                    this.imports.push(eaObject)                    
                }else{
                    eaObject = new EaObject(node,this.ast)
                } 
                return eaObject
            },
            recursion:true
        }))[Symbol.iterator]()
    } 
}

