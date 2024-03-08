import * as t from '@babel/types';
import { AstNodeIterator } from './utils';
import { EaFunction } from './function';
import { EaVariable } from './variable';


export class BlockStatement{
    private _funcIterator?:AstNodeIterator<EaFunction>
    private _varIterator?:AstNodeIterator<EaVariable>
    constructor(public body:t.Node[]){
     }
    /**
     * 遍历所有函数声明
     */
    get functions(){
        if(!this._funcIterator){
            this._funcIterator = new AstNodeIterator<EaFunction>(this.body.filter((node:t.Node)=>{
                return t.isFunctionDeclaration(node)
            }),(node:t.Node)=>{
                return new EaFunction(node)   
            })
        }
        return this._funcIterator!  
    } 
    /**
    * 遍历所有变量声明
    */
    get variables(){
        if(!this._varIterator){
            this._varIterator = new AstNodeIterator<EaVariable,t.VariableDeclaration>(this.body.filter((node:t.Node)=>{
                return t.isVariableDeclaration(node)
            }),(node:t.VariableDeclaration)=>{
                node.declarations.forEach((node:t.VariableDeclarator)=>{
                     
                })  
            })
        }
        return this._varIterator!  
    } 
}
