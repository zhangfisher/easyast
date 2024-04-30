import * as t from "@babel/types";

import { EaObject } from "./base";
import { EaIdentifier } from "./identifier";
import { createPatternObject } from "./pattern";
import { createExpressionObject } from "./expression";



export class EaLVal extends EaObject<t.LVal>{
  
}


export function createLValObject(node:t.LVal,parent?:t.Node){
    if(t.isPattern(node)){
        return createPatternObject(node,parent)
    }else if(t.isIdentifier(node)){
        return new EaIdentifier(node,parent)
    }else if(t.isExpression(node)){
        return createExpressionObject(node,parent)
    }else{
        return new EaLVal(node,parent)
    }    
}

// Identifier | MemberExpression | RestElement | AssignmentPattern | ArrayPattern 
// | ObjectPattern 
// | TSParameterProperty | TSAsExpression | TSSatisfiesExpression 
// | TSTypeAssertion | TSNonNullExpression;