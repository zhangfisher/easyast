import * as t from "@babel/types";
import { EaObject } from "./base";

export class EaIdentifier extends EaObject<t.Identifier>{
    get name(){
        return this.ast.name
    }
}