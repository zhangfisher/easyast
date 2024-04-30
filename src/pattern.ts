import * as t from '@babel/types';
import { EaObject } from './base';



export class EaPattern<T extends t.Node=t.Pattern> extends EaObject<T>{
    get kind(){
        return this.ast.type
    }
}

export class EaArrayPattern extends EaPattern<t.ArrayPattern>{
    get elements(){
        return this.ast.elements
    }
    get decorators(){
        return this.ast.decorators
    }
    get optional(){
        return this.ast.optional
    }
    get typeAnnotation(){
        return this.ast.typeAnnotation
    }
}

export class EaObjectPattern extends EaPattern<t.ObjectPattern>{
    get properties(){
        return this.ast.properties
    }
    get decorators(){
        return this.ast.decorators
    }
    get typeAnnotation(){
        return this.ast.typeAnnotation
    }
}

export class EaAssignmentPattern extends EaPattern<t.AssignmentPattern>{
    get left(){
        return this.ast.left
    }
    get right(){
        return this.ast.right
    }
}


export function createPatternObject(node:t.Node,parent?:t.Node){
    if(t.isArrayPattern(node)){
        return new EaArrayPattern(node as t.ArrayPattern,parent)
    }else if(t.isObjectPattern(node)){
        return new EaObjectPattern(node as t.ObjectPattern,parent)
    }else if(t.isAssignmentPattern(node)){
        return new EaAssignmentPattern(node as t.AssignmentPattern,parent)
    }else if(t.isPattern(node)){
        return new EaPattern(node,parent)
    }else{
        throw new Error('unknow pattern type')
    }
}