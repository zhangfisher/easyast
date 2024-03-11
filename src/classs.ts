/**
 *
 *  变量 
 *
 *  
 */

import * as t from '@babel/types';  
import { EaObject,IEaObject } from './base';
import { FlexIterator, getAstNodeName } from './utils';
import generate from '@babel/generator';
import { EaStatement } from './statement'; 
import { EaArguemnt } from './arguemnt';


export type IEaClassMethod = IEaObject & Pick<t.ClassMethod,
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
    private _args?:FlexIterator<t.Identifier | t.Pattern | t.RestElement | t.TSParameterProperty,EaArguemnt>      
    private _body?:EaStatement
    private _methodDescr?:string          

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
    get body(){
        if(!this._body){
            this._body = new EaStatement(this.ast.body,undefined)
        }
        return this._body
    }
    /**
     * 函数返回值
     */
    get returns(){
        const returnNode = this.body.body.filter((node:t.Node)=>{
            return t.isReturnStatement(node)
        })
        if(returnNode.length==0) return undefined
        return generate(returnNode[0],{compact:true}).code.substring(6)
    }
    /**
     * 函数参数
     */
    get args(){
        if(!this._args){
            this._args = new FlexIterator<t.Identifier | t.Pattern | t.RestElement | t.TSParameterProperty,EaArguemnt>(this.ast.params,{
                transform:(param)=>{
                    return new EaArguemnt(param)
                }
            })
        }
        return this._args!
    }
    toString(){
        if(!this._methodDescr){
            const node = t.cloneNode(this.ast,true,true)
            node.body = t.blockStatement([])
            this._methodDescr = generate(node).code
        }
        return this._methodDescr!
    }
}
 
 

export type IEaClassProperty = IEaObject & Pick<t.ClassProperty,
    'abstract'
    | 'computed'  
    | 'abstract' 
    | 'optional'
    | 'readonly' 
    | 'decorators'    
> & {
    access: t.ClassProperty['accessibility']
    value:string
}


export class EaClassProperty extends EaObject<t.ClassProperty , IEaClassProperty> implements IEaClassProperty{
    private _propertyDescr?:string          
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
        return this.ast.readonly
    }
    get access(){
        return this.ast.accessibility
    }
    get value(){
        return this.ast.value ? generate(this.ast.value,{}).code : ''
    }     
    toString(){
        if(!this._propertyDescr){
            const node = t.cloneNode(this.ast,true,true)
            this._propertyDescr = generate(node).code
        }
        return this._propertyDescr!
    }
}


export interface IEaClass extends IEaObject{ 

}

export class EaClass extends EaObject<t.ClassDeclaration,IEaClass> implements IEaClass{
    private _classDescr?:string    
    private _body?:EaStatement
    private _methods?:FlexIterator<t.ClassMethod,EaClassMethod>
    private _properties?:FlexIterator<t.ClassProperty,EaClassProperty>
    
    get name(){
        return t.isIdentifier(this.ast.id) ? this.ast.id.name : ''
    }
    /**
     * 返回父类
     */
    get super(){
        return t.isIdentifier(this.ast.superClass) ? getAstNodeName(this.ast.superClass) : (this.ast.superClass && generate(this.ast.superClass).code)
    }
    /**
     * 返回类方法的迭代器
     */
    get methods(){
        if(!this._methods){
            this._methods = new FlexIterator<t.ClassMethod,EaClassMethod>(this.ast.body.body.filter((node:t.Node)=>{
                return t.isClassMethod(node)
            }) as t.ClassMethod[],{
                transform:(node:t.ClassMethod)=>{
                    return new EaClassMethod(node)
                }
            })
        }
        return this._methods!
    }
    get properties(){
        if(!this._properties){
            this._properties = new FlexIterator<t.ClassProperty,EaClassProperty>(this.ast.body.body.filter((node:t.Node)=>{
                return t.isClassProperty(node)
            }) as t.ClassProperty[],{
                transform:(node:t.ClassProperty)=>{
                    return new EaClassProperty(node)
                }
            })
        }
        return this._properties!
    }
    toString(){
        if(!this._classDescr){
            const node =t.cloneNode(this.ast,true,true)
            node.body.body = []
            this._classDescr = generate(node).code
        }
        return this._classDescr!
    }
}

