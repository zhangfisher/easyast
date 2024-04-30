/**
 * 用于外部引入的模块
 */
import * as t from "@babel/types"
import { EaStatement } from "./statement";
import { EaExport } from "./exports";
import { EaImport } from "./imports";


export class EaModule extends EaStatement{    
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
    createEaObject(node:t.Node){
        let eaObject
        if(t.isExportDeclaration(node)){
            eaObject = new EaExport(node,this.ast)
            this._exports.push(eaObject)
            return eaObject
        }else if(t.isImportDeclaration(node)){
            eaObject = new EaImport(node,this.ast) 
            this._imports.push(eaObject)
            return eaObject                 
        }else{
            return super.createEaObject(node)
        }
    }
}

