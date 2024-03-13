/**
 *
 *  变量 
 *
 *  
 */

import * as t from '@babel/types';  
import { EaObject,IEaObjectProps } from './base';
import { getAstNodeCode, getAstNodeName, getTypeAnnotation } from './utils';
import generate from '@babel/generator';
import { EaStatement } from './statement'; 
import { EaArguemnt } from './arguemnt';
import { EaFunctionReturns } from './function';


export type IEaClassMethod = IEaObjectProps & Pick<t.ClassMethod,
    'abstract'
    | 'computed'
    | 'static'
    | 'generator'
    | 'async'
    | 'abstract'
    | 'access'
    | 'optional'
    | 'override' 
    | 'decorators'
> & {
    readonly: boolean
}


export class EaClassMethod extends EaObject<t.ClassMethod , IEaClassMethod> implements IEaClassMethod{ 
    private _arguments?:EaArguemnt[]      
    private _body?:EaStatement
    private _declaration?:string     
    private _returns?:EaFunctionReturns      

    protected createAstNode(props:IEaClassMethod){
        //return t.functionDeclaration(t.identifier(props.name||""),[],t.blockStatement([]),props.async,props.generator,props.arrow)
    }
    /**
     * 函数名称
     */
    get name(){
        return t.isIdentifier(this.ast.key) ? this.ast.key.name : ''
    }
    /**
     * 是否是异步函数
     */
    get async(){
        return this.ast.async
    }
    /**
     * 是否是生成器函数
     */
    get generator(){
        return this.ast.generator
    }
    /**
     * 是否是静态方法
     */
    get static(){
        return this.ast.static
    } 
    /**
     * 是否是计算属性
     */
    get computed(){
        return this.ast.computed    
    }
    /**
     * 方法类型
     */
    get kind(){
        return this.ast.kind    
    }
    /**
     * 是否是可选方法
     */
    get optional(){
        return this.ast.optional
    }    
    /**
     * 是否是重载方法
     */
    get override(){
        return this.ast.override
    }
    /**
     * 是否是抽象方法
     */
    get abstract(){
        return this.ast.override
    }    
    /**
     * 是否是只读方法
     */
    get readonly(){
        return false
    }
    /**
     * 是否是箭头函数
     */
    get arrow(){
        return false
    }
    get accessibility(){
        return this.ast.accessibility || 'public'
    }
         

    get body(){
        if(!this._body){
            this._body = new EaStatement(this.ast.body,undefined)
        }
        return this._body
    }
    /**
     * 方法返回值
     */
    get returns(){
        if(!this._returns){
            const returnNode = this.body.ast.body.filter((node:t.Node)=>{
                return t.isReturnStatement(node)
            }) as t.ReturnStatement[]
            if(returnNode.length==0){
                this._returns = new EaFunctionReturns(t.returnStatement(),this.ast.returnType)
            }else{
                this._returns = new EaFunctionReturns(returnNode[0],this.ast.returnType)
            }            
        }
        return this._returns!    
    }
    /**
     * 函数参数
     */
    get arguments(){
        if(!this._arguments){
            this._arguments = this.ast.params.map((param)=>{
                    return new EaArguemnt(param)
                }) as EaArguemnt[]
        }
        return this._arguments!
    }
    toString(){
        if(!this._declaration){
            const node = t.cloneNode(this.ast,true,true)
            node.body = t.blockStatement([])
            this._declaration = generate(node).code
        }
        return this._declaration!
    }
}
 
export class EaClassGetter extends EaClassMethod{
    get typeAnnotation(){
        return super.returns.typeAnnotation
    }
}
export class EaClassSetter extends EaClassMethod{    
    get typeAnnotation(){
        return  super.arguments.length>0 ? super.arguments[0].typeAnnotation : 'any'
    }
}


export type IEaClassProperty = IEaObjectProps & Pick<t.ClassProperty,
    'abstract'
    | 'computed'  
    | 'abstract' 
    | 'optional'
    | 'readonly' 
    | 'decorators'    
> & {
    accessibility: t.ClassProperty['accessibility'] 
}


export class EaClassProperty extends EaObject<t.ClassProperty , IEaClassProperty> implements IEaClassProperty{
    private _declaration?:string          
    protected createAstNode(props:IEaClassProperty){
        //return t.functionDeclaration(t.identifier(props.name||""),[],t.blockStatement([]),props.async,props.generator,props.arrow)
    }
    get name(){
        return t.isIdentifier(this.ast.key) ? this.ast.key.name : ''
    }
    get abstract(){
        return this.ast.abstract
    }
    get computed(){
        return this.ast.computed
    }
    get optional(){
        return this.ast.optional
    }
    get readonly(){
        return this.ast.readonly==undefined ? false : this.ast.readonly
    }
    get accessibility(){
        return this.ast.accessibility || 'public'
    }
    get static(){
        return this.ast.static
    }
    get typeAnnotation(){
        return getTypeAnnotation(this.ast)
    }
    get value(){
        if(!this.ast.value) return undefined
        const initNode = this.ast.value
        if(t.isBooleanLiteral(initNode)){
            return initNode.value
        }else if(t.isStringLiteral(initNode)){
            return initNode.value
        }else if(t.isNumericLiteral(initNode)){
            return initNode.value
        }else{
            return getAstNodeCode(initNode)
        }   
    } 
    toString(){
        if(!this._declaration){
            const node = t.cloneNode(this.ast,true,true)
            this._declaration = getAstNodeCode(node)
        }
        return this._declaration!
    }
}


export interface IEaClass extends IEaObjectProps{ 

}

export class EaClass extends EaObject<t.ClassDeclaration,IEaClass> implements IEaClass{
    private _declaration?:string    
    private _body?:EaStatement
    private _methods?:EaClassMethod[] 
    private _properties?:EaClassProperty[]     
    private _getters?:EaClassGetter[]
    private _setters?:EaClassSetter[]     

    get name(){
        return t.isIdentifier(this.ast.id) ? this.ast.id.name : ''
    }
    get body(){
        return this._body || (this._body = new EaStatement(this.ast.body,undefined))
    }
    /**
     * 返回父类
     */
    get superClass(){
        return t.isIdentifier(this.ast.superClass) ? getAstNodeName(this.ast.superClass) : (
            this.ast.superClass==null ? 'undefined' : generate(this.ast.superClass).code
        )
    }
    /**
     * 返回类方法的迭代器
     */
    get methods(){
        if(!this._methods){
            this._methods = this.ast.body.body.filter((node:t.Node)=>{ 
                return t.isClassMethod(node) && ["constructor","method"].includes(node.kind)
            }).map((node)=>new EaClassMethod(node)) as EaClassMethod[]
        }
        return this._methods!
    }
    /**
     * 返回构造函数
     */
    getConstructor(){
        if(this.methods.length==0) return undefined
        return this.methods.find((method)=>method.kind=='constructor')
    }
    get properties(){
        if(!this._properties){
            this._properties = this.ast.body.body.filter((node:t.Node)=>{
                return t.isClassProperty(node)
            }).map(node=>new EaClassProperty(node)) as EaClassProperty[]
        }
        return this._properties!
    }
    get getters(){
        if(!this._getters){
            this._getters = this.ast.body.body.filter((node:t.Node)=>{
                return t.isClassMethod(node) && node.kind=='get'
            }).map(node=>new EaClassGetter(node)) as EaClassGetter[]
        }
        return this._getters!
    
    }
    get setters(){
        if(!this._setters){
            this._setters = this.ast.body.body.filter((node:t.Node)=>{
                return t.isClassMethod(node) && node.kind=='set'
            }).map(node=>new EaClassSetter(node)) as EaClassSetter[]
        }
        return this._setters!
    
    }
    toString(){
        if(!this._declaration){
            const node =t.cloneNode(this.ast,true,true)
            node.body.body = []
            this._declaration = generate(node).code
        }
        return this._declaration!
    }
}

