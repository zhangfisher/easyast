/***



 */

import * as parser from "@babel/parser";
import { isEsmModule } from "./utils";
import { EaModule } from "./module";
import * as t from "@babel/types"
import generate, { GeneratorOptions } from "@babel/generator";
import { EaObjectOptions } from "./base";

export interface EasyASTOptions{
    typescript?: boolean;
    sourceType?: parser.ParserOptions['sourceType']
    jsx?: boolean;         
}

/**
 * 默认代码生成器
 * 根据AST生成代码
 * @param ast 
 * @param options 
 * @returns 
 */
export function generator(ast:t.Node,options?:GeneratorOptions){
    return generate(ast,Object.assign({
        retainLines:false,
        compact:false
    },options))
}


export class EasyAST extends EaModule{
    constructor(code: string, options?: EasyASTOptions & EaObjectOptions) {
        // 准备配置参数
        const opts = Object.assign({
            typescript:true,
            jsx:true
        },options)
        const babelOptions:parser.ParserOptions = {plugins:[]}
        if(opts.typescript) babelOptions.plugins!.push("typescript")
        if(opts.jsx) babelOptions.plugins!.push("jsx")
        babelOptions.sourceType = isEsmModule(code) ?  'module' : 'script'        
        super(parser.parse(code,babelOptions).program.body[0] as any,undefined,options)        
    }   
    get options(){
        return super.options as Required<EasyASTOptions & EaObjectOptions>
    }
}
 