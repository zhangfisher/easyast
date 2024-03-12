/**
 * 
 * 表达式种类太多，不做详细定义封装
 * 无论何种表达式均返回表达式的代码
 * 
 * 只做简单封装
 * 
 * expr = new Expression(node)
 * 
 * expr.type 获取表达式类型
 * expr.code 获取表达式代码
 * expr.ast 获取表达式AST节点
 * 
 * expr.value  表达式
 * 
 * 
 */

import * as t from "@babel/types"
import { EaObject } from './base';
import { EaFunction } from "./function";
import generate from "@babel/generator";


export interface IEaExpression{
}

export class EaExpression extends EaObject<t.Expression> implements IEaExpression{ 
     
}

 