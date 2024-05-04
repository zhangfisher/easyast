import * as t from '@babel/types'
import generate from '@babel/generator'
import { beforeAll as viteBeforeAll } from 'vitest'
import { EaObject } from '../src/base'

/**
 * 测试时为了方便进行代码断言，压缩生成代码
 * @param node 
 * @returns 
 */
export function codeGenerator(node:t.Node){
    return generate(node,{
        retainLines:false,
        compact:true
    })
}

export const beforeAll = (fn?:Function)=>viteBeforeAll(async ()=>{
    EaObject.generator = codeGenerator
    if(fn) await fn()
})