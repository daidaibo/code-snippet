const { readFileSync } = require('fs')
const path = require('path')
const { Script } = require('vm')

function myCjs(filename) {
  const fileContent = readFileSync(path.resolve(__dirname, filename), 'utf-8')

  const wrap = `(function (require, module, exports) {
    ${fileContent}
  })`

  const script = new Script(wrap, {
    filename: 'index.js'
  })

  const module = {
    exports: {}
  }

  const func = script.runInThisContext()
  func(myCjs, module, module.exports)
  return module.exports
}

global.myCjs = myCjs

myCjs('./index.js')
