/**


easyast.exports = EaExport[]
EaExport.declaration 
EaExport.specifiers
EaExport.source 


*/

import { EaObject } from "./base"
import * as t from "@babel/types"

export class EaExportSpecifier  extends EaObject<t.ExportSpecifier>{
    get kind(){        
        return this.ast.exportKind
    }
    /**
     * 本地名称, 即导入后的重命名
     */
    get local(){
        return this.ast.local.name 
    } 
    /**
     * 导出的名称
     */
    get exported(){
        return t.isStringLiteral(this.ast.exported) ? this.ast.exported.value : this.ast.exported.name 
    }
    get isExported(){
        return true
    } 
}


/**
 * 导出可以是常量，对象，类，函数等
 */
export class EaExport extends EaObject<t.ExportDeclaration>{
    private _specifiers?:EaExportSpecifier[]
    get specifiers(){
        if(!this._specifiers){
            if(t.isExportNamedDeclaration(this.ast) && this.ast.specifiers.length>0){
                this._specifiers = this.ast.specifiers.map((node)=>{
                    return new EaExportSpecifier(node,this.ast)
                })
            }
        }
        return this._specifiers
    }
    get source(){
        return t.isExportAllDeclaration(this.ast) ?  this.ast.source.value : ''
    }

    get kind(){
        return this.ast.exportKind
    }
    /**
     * 是否导出所有
     */
    get all(){
        return t.isExportAllDeclaration(this.ast)
    }
    /**
     * 是否默认导出
     */
    get default(){
        return t.isExportDefaultDeclaration(this.ast)
    }

}

