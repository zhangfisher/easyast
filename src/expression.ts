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

//type Expression = ArrayExpression | AssignmentExpression | BinaryExpression | CallExpression | ConditionalExpression
// | FunctionExpression | Identifier | StringLiteral | NumericLiteral | NullLiteral | BooleanLiteral 
// | RegExpLiteral | LogicalExpression | MemberExpression | NewExpression | ObjectExpression | SequenceExpression | ParenthesizedExpression | ThisExpression | UnaryExpression | UpdateExpression | ArrowFunctionExpression | ClassExpression | ImportExpression | MetaProperty | Super | TaggedTemplateExpression | TemplateLiteral | YieldExpression | AwaitExpression | Import | BigIntLiteral | OptionalMemberExpression | OptionalCallExpression | TypeCastExpression | JSXElement | JSXFragment | BindExpression | DoExpression | RecordExpression | TupleExpression | DecimalLiteral | ModuleExpression | TopicReference | PipelineTopicExpression | PipelineBareFunction | PipelinePrimaryTopicReference | TSInstantiationExpression | TSAsExpression | TSSatisfiesExpression | TSTypeAssertion | TSNonNullExpression;

export class EaExpression<T extends t.Node=t.Expression> extends EaObject<T>{ 
    get kind(){
        return this.ast.type
    } 
}


export class EaArrayExpression extends EaExpression<t.ArrayExpression>{ 
    get elements(){
        return this.ast.elements
    }
}
export class EaMemberExpression extends EaExpression<t.MemberExpression>{ 
    get object(){
        return this.ast.object
    }  
    get property(){
        return this.ast.property
    }
    get computed(){
        return this.ast.computed
    }
    get optional(){
        return this.ast.optional
    }
}

export class EaAssignmentExpression extends EaExpression<t.AssignmentExpression>{ 
    get operator(){
        return this.ast.operator    
    } 
    get left(){
        return this.ast.left
    }
    get right(){
        return this.ast.right    
    }
}
export class EaBinaryExpression extends EaExpression<t.BinaryExpression>{ 
    get operator(){
        return this.ast.operator    
    }  
    get left(){
        return this.ast.left
    }
    get right(){
        return this.ast.right
    }
}


export class EaConditionalExpression extends EaExpression<t.ConditionalExpression>{ 
    get test(){
        return this.ast.test  
    } 
    get consequent(){
        return this.ast.consequent        
    }
    get alternate(){
        return this.ast.alternate        
    }
}

export class EaAwaitExpression extends EaExpression<t.AwaitExpression>{  
    get argument(){
        return this.ast.argument
    }
} 
export class EaYieldExpression extends EaExpression<t.YieldExpression>{  
    get argument(){
        return this.ast.argument
    }
} 
export class EaNewExpression extends EaExpression<t.NewExpression>{  
    get callee(){
        return this.ast.callee
    }
    get arguments(){
        return this.ast.arguments
    }
    get optional(){
        return this.ast.optional
    }
    get typeArguments(){
        return this.ast.typeArguments
    }
    get typeParameters(){
        return this.ast.typeParameters
    }
} 


export class EaLogicalExpression extends EaExpression<t.LogicalExpression>{  
    get operator(){
        return this.ast.operator
    }
    get left(){
        return this.ast.left
    }
    get right(){
        return this.ast.right
    }
}

export class EaFunctionExpression extends EaExpression<t.FunctionExpression>{ 
 
}


export class EaCallExpression extends EaExpression<t.CallExpression>{  
} 