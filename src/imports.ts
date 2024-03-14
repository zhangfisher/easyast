import generate from "@babel/generator"
import { EaObject } from "./base"
import * as t from "@babel/types"

export type ImportSpecifier =t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier  
 

export class EaImport extends EaObject<ImportSpecifier,t.ImportDeclaration>{ 
    get source(){
        return this.ast.source.value
    } 
    get kind(){
        const pKind =this.parentAst && t.isImportDeclaration(this.parentAst) ?  this.parentAst.importKind : undefined
        return pKind!=='value' ? pKind : this.ast.importKind
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
        return this.ast.imported ? 
            (t.isIdentifier(this.ast.imported)  ? this.ast.imported.name : this.ast.imported.value)
            : (this.ast.local ? this.ast.local.name : '')
    }
}


export function parseImports(ast:t.Program){
    return (ast.body.filter((node:t.Node)=>{
        return t.isImportDeclaration(node)
    }) as t.ImportDeclaration[]).reduce<[ImportSpecifier,t.ImportDeclaration][]>((prev,importDeclaration:t.ImportDeclaration)=>{
        importDeclaration.specifiers.forEach((specifier)=>{
            prev.push([specifier,importDeclaration])
        })
        return prev
    },[]).map(([specifier,importDeclaration])=>{
        return new EaImport(specifier,importDeclaration)
    })

}