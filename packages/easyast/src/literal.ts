import * as t from "@babel/types";
import { EaObject } from "./base";

export class EaLiteral<T extends t.Node = t.Literal> extends EaObject<T>{
    get value(){
        return 'value' in this.ast ? this.ast.value : undefined
    } 
    get tsType(){
        if(t.isStringLiteral(this.ast)) return 'string'
        if(t.isNumericLiteral(this.ast)) return 'number'
        if(t.isBooleanLiteral(this.ast)) return 'boolean'
        if(t.isNullLiteral(this.ast)) return 'null'
        if(t.isRegExpLiteral(this.ast)) return 'regexp'
        if(t.isBigIntLiteral(this.ast)) return 'bigint'
        if(t.isTemplateLiteral(this.ast)) return 'template'
        if(t.isBigIntLiteral(this.ast)) return 'bigint'
        return 'unknow'
    }   
}


export class EaRegExpLiteral extends EaLiteral<t.RegExpLiteral>{
    get pattern(){
        return this.ast.pattern
    }
    get flags(){
        return this.ast.flags
    }
}

export class EaTemplateLiteral extends EaLiteral<t.TemplateLiteral>{
    get quasis(){
        return this.ast.quasis
    }
    get expressions(){
        return this.ast.expressions
    } 
}

export function createLiteralObject(node:t.Literal,parent?:t.Node){
    if(t.isRegExpLiteral(node)){
        return new EaRegExpLiteral(node,parent)
    }else if(t.isTemplateLiteral(node)){
        return new EaTemplateLiteral(node,parent)
    }else{
        return new EaLiteral(node,parent)
    }
}