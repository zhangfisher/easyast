/***



 */

import * as parser from "@babel/parser";
import { isEsmModule } from "./utils";
import { EaModule } from "./module";

export interface EasyASTOptions{
    typescript: boolean;
    sourceType: parser.ParserOptions['sourceType']
    jsx: boolean;         
}

export class EasyAST extends EaModule{
    options: EasyASTOptions;
    constructor(code: string, options?: EasyASTOptions) {
        // 准备配置参数
        const opts = Object.assign({
            typescript:true,
            jsx:true
        },options)
        const babelOptions:parser.ParserOptions = {plugins:[]}
        if(opts.typescript) babelOptions.plugins!.push("typescript")
        if(opts.jsx) babelOptions.plugins!.push("jsx")
        babelOptions.sourceType = isEsmModule(code) ?  'module' : 'script'        
        super(parser.parse(code,babelOptions).program)        
        this.options = opts        
    }   

}
 