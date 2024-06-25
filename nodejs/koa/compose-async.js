async function freight(total, next) {
  console.log(total)
  return await next(total + 12)
}

async function discount(total, next) {
  console.log(total)
  await delay()
  return await next(total * 0.8)
}

async function num(price, next) {
  console.log(price)
  return await next(price * 10)
}

function delay() {
  return new Promise((reslove) => {
    setTimeout(() => {
      reslove()
    }, 2000)
  })
}

function compose(middlewares) {
  return function (ctx) {
    return dispatch(0, ctx)
    function dispatch(i, ctx) {
      let fn = middlewares[i]
      console.log(arguments)
      if (!fn) {
        return Promise.resolve(ctx)
      }
      return Promise.resolve(
        fn(ctx, function next(ctx) {
          return dispatch(i + 1, ctx)
        })
      )
    }
  }
}

const totalMoney = compose([num, discount, freight])
totalMoney(15).then((r) => {
  console.log(r)
})
