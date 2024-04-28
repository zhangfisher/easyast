

export {}

declare module "@babel/types" {
    export interface BaseNode {
        _easyAstMeta:{
            exported?:boolean       // 标志为导出
        }
    }
}


/**
 * 
 * 在ast节点上添加的元数据,供EasyAst使用
 */
export interface EasyASTMeta{
    exported?:boolean       // 标志为导出
    
}