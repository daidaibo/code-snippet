import Koa from 'koa'
import Router from 'koa-router'

import './controller/index'
import { controllers } from './core/decorator'

const app = new Koa()
const router = new Router()

console.log(controllers)

controllers.forEach(item => {
  let {
    url,
    method,
    handler,
    constructor
  } = item

  const { prefix } = constructor
  if (prefix) url = `${prefix}${url}`

  router[method](url, handler)
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  // http://localhost:3000/test/get
  console.log('koa server starting...')
})
