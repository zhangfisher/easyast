import generate from "@babel/generator"
import { EaObject } from "./base"
import * as t from "@babel/types"

export class EaImportSpecifier  extends EaObject<t.ImportSpecifier>{
    get kind(){
        return this.ast.importKind
    }
    /**
     * 本地名称, 即导入后的重命名
     */
    get local(){
        return this.ast.local ? this.ast.local.name : this.name
    }
    /**
     * 导入的名称
     */
    get name(){
        return t.isIdentifier(this.ast.imported)  ? this.ast.imported.name : this.ast.imported.value
    }
}

export class EaImport extends EaObject<t.ImportDeclaration>{
    private _specifiers?:EaImportSpecifier[]

    get specifiers(){
        if(!this._specifiers){
            this._specifiers = this.ast.specifiers.map((node)=>{
                return new EaImportSpecifier(node)
            })
        }
        return this._specifiers
    }
    get source(){
        return this.ast.source.value
    } 
    /**
     * "type" | "typeof" | "value" 
     */
    get kind(){
        return this.ast.importKind
    }

}