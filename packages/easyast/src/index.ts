export * from "./arguemnt"
export * from "./base"
export * from "./classs"
export * from "./expression"
export * from "./function"
export * from "./identifier"
export * from "./module"
export * from "./statement"
export * from "./variable"
export * from "./exports"
export * from "./imports"
export * from "./utils"
export * from "./types"
export * from "./ast"



// Program: 代表整个 JavaScript 程序的根节点。
// FunctionDeclaration / FunctionExpression: 代表函数声明和函数表达式。
// VariableDeclaration / VariableDeclarator: 代表变量声明，其中 VariableDeclaration 是包含一个或多个 VariableDeclarator 的父节点。
// Identifier: 代表标识符，如变量名、函数名等。
// Literal: 代表字面量，如数字、字符串、布尔值等。

// CallExpression: 代表函数调用。
// MemberExpression: 代表成员访问，如 object.property 或 object[method]。
// BinaryExpression: 代表二元表达式，如 a + b 或 a > b。
// UnaryExpression: 代表一元表达式，如 !a 或 ++b。
// ThisExpression: 代表 this 关键字。
// ArrayExpression: 代表数组字面量。
// ObjectExpression: 代表对象字面量。
// TaggedTemplateExpression: 代表标签模板字符串。
// ArrowFunctionExpression: 代表箭头函数。
// AssignmentExpression: 代表赋值表达式，如 a = b 或 a += b。

// BlockStatement: 代表代码块，通常由大括号 {} 包围。
// IfStatement: 代表 if 条件语句。
// ForStatement / WhileStatement: 代表 for 循环和 while 循环。
// DoWhileStatement: 代表 do...while 循环。
// SwitchStatement: 代表 switch 语句。
// CaseClause / DefaultClause: 代表 switch 语句中的 case 和 default 分支。
// ReturnStatement: 代表 return 语句。
// BreakStatement / ContinueStatement: 代表 break 和 continue 语句，用于控制循环的执行。
// TryStatement / CatchClause / FinallyBlock: 代表 try...catch...finally 异常处理结构。
// ThrowStatement: 代表 throw 语句，用于抛出异常。
// DebuggerStatement: 代表调试器语句，用于断点调试。

// Property: 代表对象字面量中的属性。
// SpreadElement: 代表在数组或对象字面量中的扩展操作符 ...。
// TemplateLiteral: 代表模板字符串。

// ClassDeclaration / ClassExpression: 代表类声明和类表达式。
// Super: 代表 super 关键字，用于调用父类方法。
// ImportDeclaration / ExportNamedDeclaration / ExportDefaultDeclaration: 代表 ES6 模块的导入和导出语句。
 