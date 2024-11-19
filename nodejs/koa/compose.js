
// const discount = (dis) => (pri) => pri * dis

// const discount7 = discount(0.7)
// const discount8 = discount(0.8)

// function freight(total) {
//   return total + 12
// }

// function num(price) {
//   return price * 10
// }

// const compose1 = (...mids) => (val) => mids.reduce((total, fn) => fn(total), val)

// const compose2 = (...[first, ...others]) => (...args) => {
//   let result = first(...args)
//   others.forEach(fn => {
//     result = fn(result)
//   })
//   return result
// }

// const compose3 = (...mids) => {
//   return mids.reduce((leftFn, rightFn) => (...args) =>
//     rightFn(leftFn(...args))
//   )
// }
// (...args) => freight(discount(num(...args)))

// const totalMoney = compose3(num, discount8, freight)(15)
// console.log(totalMoney)


/*
[func1, func2].reduce((p, f) => p.then(f), Promise.resolve())
等同于
  Promise.resolve().then(func1).then(func2)

抽象成
let applyAsync = (acc, val) => acc.then(val)
let composeAsync = (...funcs) => x => funcs.reduce(applyAsync, Promise.resolve(x))

使用
let transformData = composeAsync(func1, asyncFunc1, asyncFunc2, func2)
transformData(data)
*/

function freight(total, next) {
  next(total + 12)
}

function discount(total, next) {
  next(total * 0.8)
}

function num(price, next) {
  next(price * 10)
}

const compose = function (mids) {
  let result
  return function (ctx) {
    let dispatch = function (i, ctx) {
      if (i < mids.length) {
        let fn = mids[i]
        fn(ctx, dispatch.bind(null, ++i))
      } else {
        result = ctx
      }
    }
    dispatch(0, ctx)
    return result
  }
}

const totalMoney = compose([num, discount, freight])(15)

console.log(totalMoney)
