/**
 *
 *  变量 
 *
 *  
 */

import * as t from '@babel/types';  
import { EaObject,EaObjectProps } from './base';
import { FlexIterator } from './utils';
import generate from '@babel/generator';
import { EaStatement } from './statement';
import { EaFunction } from './function';

export class EaClasMethod extends EaFunction<t.ClassMethod>{   
    get computed(){
        return this.ast.computed    
    }
    kind?:t.ClassMethod['kind']
}

let d:EaClasMethod




export interface EaClassProps extends EaObjectProps{ 

}

export class EaClass extends EaObject<t.ClassDeclaration,EaClassProps>{
    private _classDescr?:string    
    private _body?:EaStatement
    private _methods?:FlexIterator<t.ClassMethod,EaFunction>
    get name(){
        return t.isIdentifier(this.ast.id) ? this.ast.id.name : ''
    }
    /**
     * 返回类方法的迭代器
     */
    get methods(){
        if(!this._methods){
            this._methods = new FlexIterator<t.ClassMethod,EaFunction>(this.ast.body.body.filter((node:t.Node)=>{
                return t.isClassMethod(node)
            }) as t.ClassMethod[],{
                transform:(node:t.ClassMethod)=>{
                    return new EaClasMethod(node)
                }
            })
        }
        return this._methods!
    }
    get properties(){
        return []
    }
    toString(){
        if(!this._classDescr){
            const node =t.cloneNode(this.ast,false,true)
            node.body.body = []
            this._classDescr = generate(node).code
        }
        return this._classDescr!
    }
}

