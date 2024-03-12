import * as t from '@babel/types';
import { FlexIterator } from './utils';
import { EaFunction } from './function';
import { EaVariable } from './variable';
import { EaObject } from './base';
import { EaClass } from './classs';
import generate from '@babel/generator';


export interface IEaStatement extends EaObject{}
 
export class EaStatement extends EaObject<t.Program>{
    private _functions?:EaFunction[]
    private _variables?:EaVariable[]
    private _statements?:EaStatement[]
    private _classs?:EaClass[]


    /**
     * 获取代码
     */
    get body(){
        return 
    }    
    /**
     * 遍历所有函数声明
     */
    get functions(){
        if(!this._functions){
            this._functions = this.ast.body.filter((node:t.Node)=>{
                return t.isFunctionDeclaration(node)
            }).map((node)=>{
                return new EaFunction(node)                   
            })
        }
        return this._functions! 
    } 
    /**
    * 遍历所有变量声明
    */
    get variables(){
        if(!this._variables){
            this._variables = [...new FlexIterator<t.VariableDeclarator,EaVariable,t.VariableDeclaration>(this.ast.body.filter((node: t.Node) => {
                    return t.isVariableDeclaration(node);
                }) as unknown as t.VariableDeclarator[],{
                pick:(item:t.VariableDeclaration | t.VariableDeclarator)=>{
                    return t.isVariableDeclaration(item) ?  (item as t.VariableDeclaration).declarations  : item
                },
                transform:(node:t.VariableDeclarator,parent?:t.VariableDeclaration)=>{                    
                    return new EaVariable(node,parent)
                },
                recursion:true
            })]
        }
        return this._variables!
    } 
    /**
    * 遍历所有类明
    */
    get classs(){
        if(!this._classs){
            this._classs = this.ast.body.filter((node:t.Node)=>{
                return t.isClassDeclaration(node)
            }).map((node)=>{
                    return new EaClass(node)                   
            })
        }
        return this._classs!   
    } 
    /**
     * 遍历所有代码块
     */
    get statements(){
        if(!this._statements){
            this._statements = this.ast.body.filter((node:t.Node)=>{
                return t.isBlockStatement(node)
            }).map((node)=>{
                return new EaStatement(node)                   
            })
        }
        return this._statements
    }    
    /**
     * 按顺序遍历所有节点，返回节点对象
     * @returns 
     */
    [Symbol.iterator](){
        return new FlexIterator<any,any,any>(this.ast.body,{
            transform:(node:t.Node)=>{
                if(t.isFunctionDeclaration(node)){
                    return new EaFunction(node,this.ast)
                }else if(t.isVariableDeclaration(node)){
                    return new EaVariable(node,this.ast)
                }else if(t.isClassDeclaration(node)){
                    return new EaClass(node,this.ast)
                }else if(t.isExpression(node)){
                    return new EaStatement(node)
                }else if(t.isBlockStatement(node)){
                    return new EaStatement(node)
                }
            }
        })
    }

}
