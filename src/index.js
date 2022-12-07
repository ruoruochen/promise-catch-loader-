
/**
 * transform
 * 
 * this.axiosFetch(this.formData).then(res => {
    this.loading = false
    this.handleClose()
  })

  To:

  this.axiosFetch(this.formData).then(res => {
    this.loading = false
    this.handleClose()
  }).catch((e) => {
    this.loading = false
  })
 */

/**
 * 步骤：
 * 1. 取出them第一行表达式 
 * 存在callExpresion 、property.name = then
 * 第一个ArrowFunctionExpression BlockStatement 的第一个ExpressionStatement
 * 2. 创建catch执行的箭头函数，并插入表达式
 * 3. 创建MemberExpression、CallExpreesion，包裹原MemberExpression
 * 4. 替换原内容
 * 
 * 
 * 条件判断：
 * - arguments为箭头函数
 * - firstExp判断是否存在
 * - promise有自定义catch修改
 */

// CMD
const recast = require('recast');
const {
  identifier: id,
  arrowFunctionExpression,
  blockStatement,
  memberExpression,
  callExpression
} = recast.types.builders
const t = recast.types.namedTypes

module.exports = function (source) {
  // parser替换：默认的解析器为 recast/parsers/esprima，一般我们项目中都会用到 babel-loader
  const ast = recast.parse(source,{
    parse:require('recast/parsers/babel')
  })

  recast.visit(ast, {
    visitCallExpression (path) {
      
      const { node } = path
      const arguments = node.arguments
      let firstExp
  
      arguments.forEach(item => {
        // 保存箭头函数
        if (t.ArrowFunctionExpression.check(item)) {
          firstExp = item.body.body[0]
          console.log('visit',t.ExpressionStatement.check(firstExp) &&
          t.Identifier.check(node.callee.property) &&
          node.callee.property.name === 'then',t.Identifier.check(node.callee.property),node.callee.property.name)
          // 函数存在 && 调用callExpresion为then
          if (
            t.ExpressionStatement.check(firstExp) &&
            t.Identifier.check(node.callee.property) &&
            node.callee.property.name === 'then'
          ) {
            // console.log('visitCallExpression',node.callee.property.name,firstExp)
            const arrowFunc = arrowFunctionExpression([], blockStatement([firstExp]))
            const originFunc = callExpression(node.callee, node.arguments)
            const catchFunc = callExpression(id('catch'), [arrowFunc])
            const newFunc = memberExpression(originFunc, catchFunc)
    
            path.replace(newFunc)
          }
        }
      })
      return false
    }
  })

  return recast.print(ast).code
}