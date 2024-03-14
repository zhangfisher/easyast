/**


easyast.exports = EaExport[]
EaExport.declaration 
EaExport.specifiers
EaExport.source 


*/

import generate from "@babel/generator"
import { EaObject } from "./base"
import * as t from "@babel/types"

// export class EaExportSpecifier  extends EaObject<t.ExportSpecifier>{
//     get kind(){
//         const pKind =this.parentAst && t.isImportDeclaration(this.parentAst) ?  this.parentAst.importKind : undefined
//         return pKind!=='value' ? pKind : this.ast.importKind
//     }
//     /**
//      * 本地名称, 即导入后的重命名
//      */
//     get local(){
//         return this.ast.local ? this.ast.local.name : this.name
//     }
//     /**
//      * 导入的名称
//      */
//     get name(){
//         return this.ast.imported ? 
//             (t.isIdentifier(this.ast.imported)  ? this.ast.imported.name : this.ast.imported.value)
//             : (this.ast.local ? this.ast.local.name : '')
//     }
// }


/**
 * 导出可以是常量，对象，类，函数等
 */
export class EaExport extends EaObject<t.ExportDeclaration>{
    private _specifiers?:EaExportSpecifier[]

    get specifiers(){
        if(!this._specifiers){
            this._specifiers = this.ast.declaration.map((node)=>{
                return new EaExportSpecifier(node,this.ast)
            })
        }
        return this._specifiers
    }
    /**
     * 当使用export {} from "x=module"时，source=module
     */
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