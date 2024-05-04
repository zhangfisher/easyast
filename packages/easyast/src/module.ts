/**
 * 用于外部引入的模块
 */
import * as t from "@babel/types"
import { EaBlockStatement } from "./statement";
import { EaExport } from "./exports";
import { EaImport } from "./imports";


export class EaModule extends EaBlockStatement{    
    private _exports:EaExport[] = []      
    private _imports:EaImport[] = []     
    
    get sourceType(){
        return (this.ast as unknown as t.Program).sourceType
    } 
    parse(){
        this._exports=[]
        this._imports=[]
        super.parse()
    }      
    get exports(){
        if(!this._parsed) this.parse()
        return this._exports        
    }
    get imports(){
        if(!this._parsed) this.parse()
        return this._imports        
    }

    createExportedObject(node:t.ExportDeclaration){
        let eaObject= new EaExport(node,this)
        this._exports.push(eaObject)
        return eaObject  
    }
    createImportedObject(node:t.ImportDeclaration){
        let eaObject = new EaImport(node,this) 
        this._imports.push(eaObject)
        return eaObject            
    }
}

