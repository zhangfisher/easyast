/**
 * 用于外部引入的模块
 */
import * as t from "@babel/types"
import { EaStatement } from "./statement";
import { EaExport } from "./exports";
import { EaImport } from "./imports";


export class EaModule extends EaStatement<t.Program>{    
    public exports:EaExport[] = []      
    public imports:EaImport[] = []              
    createEaObject(node:t.Node){
        let eaObject
        if(t.isExportDeclaration(node)){
            eaObject = new EaExport(node,this.ast)
            this.exports.push(eaObject)
            return eaObject
        }else if(t.isImportDeclaration(node)){
            eaObject = new EaImport(node,this.ast)
            if(!this.imports) this.imports =[]
            this.imports.push(eaObject)
            return eaObject                 
        }else{
            return super.createEaObject(node)
        }
    }
}

