import * as t from '@babel/types'
import generate from '@babel/generator'
export function codeGenerator(node:t.Node){
    return generate(node,{
        retainLines:false,
        compact:true
    })
}