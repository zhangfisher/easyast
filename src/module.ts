/**
 * 用于外部引入的模块
 */
import * as t from "@babel/types"
import { EaStatement } from "./statement";
import { EaExport } from "./exports";
import { EaImport } from "./imports";


export class EaModule extends EaStatement<t.Program>{    
    exports:EaExport[] = []             // 导出的对象
    imports:EaImport[] = []             // 导入的对象
        
}