async function fn1(next) {
  console.log('fn1')
  await next()
  console.log('End fn1')
  return 'koa'
}

async function fn2(next) {
  console.log('fn2')
  await delay()
  console.log(await next())
  console.log('End fn2')
}

async function fn3(next) {
  console.log('fn3')
  await next()
  return 'End fn3'
}

function delay() {
  return new Promise((reslove) => {
    setTimeout(() => {
      reslove()
    }, 2000)
  })
}

function compose(middlewares) {
  return function () {
    return dispatch(0)
    function dispatch(i) {
      let fn = middlewares[i]
      return Promise.resolve(
        fn && fn(function next() {
          return dispatch(i + 1)
        })
      )
    }
  }
}

compose([fn1, fn2, fn3])()
  .then((r) => {
    console.log(r)
  })
