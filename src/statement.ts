import * as t from '@babel/types';
import { FlexIterator } from './utils';
import { EaFunction } from './function';
import { EaVariable } from './variable';
import { EaObject } from './base';


export interface IEaStatement extends EaObject{}

export class EaStatement extends EaObject<t.Program>{
    private _funcIterator?:FlexIterator<t.FunctionDeclaration,EaFunction>
    private _varIterator?:FlexIterator<t.VariableDeclarator,EaVariable,t.VariableDeclaration>

    get body(){
        return this.ast.body
    }    

    /**
     * 遍历所有函数声明
     */
    get functions(){
        if(!this._funcIterator){
            this._funcIterator = new FlexIterator<t.FunctionDeclaration,EaFunction>(this.body.filter((node:t.Node)=>{
                return t.isFunctionDeclaration(node)
            }) as t.FunctionDeclaration[],{
                transform:(node:t.FunctionDeclaration)=>{
                    return new EaFunction(node)   
                }
            })
        }
        return this._funcIterator!  
    } 
    /**
    * 遍历所有变量声明
    */
    get variables(){
        if(!this._varIterator){
            this._varIterator = new FlexIterator<t.VariableDeclarator,EaVariable,t.VariableDeclaration>(this.body.filter((node: t.Node) => {
                    return t.isVariableDeclaration(node);
                }) as unknown as t.VariableDeclarator[],{
                pick:(item:t.VariableDeclaration | t.VariableDeclarator)=>{
                    return t.isVariableDeclaration(item) ?  (item as t.VariableDeclaration).declarations  : item
                },
                transform:(node:t.VariableDeclarator,parent?:t.VariableDeclaration)=>{                    
                    return new EaVariable(node,parent)
                },
                recursion:true
            })
        }
        return this._varIterator!  
    } 
}
