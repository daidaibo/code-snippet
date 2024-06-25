/* 扁平化数组 */
function flatArr(arr) {
  const isDeep = arr.some(item => item instanceof Array)
  if (!isDeep) return arr
  const res = Array.prototype.concat.apply([], arr)
  return flatArr(res)
}

/* 千分位 */
function thousandFormat(n) {
  n = Math.floor(n) // 只考虑整数

  const s = n.toString()
  const arr = s.split('').reverse()
  return arr.reduce((prev, val, index) => {
    if (index % 3 === 0) {
      if (prev) {
        return val + ',' + prev
      } else {
        return val
      }
    } else {
      return val + prev
    }
  }, '')
}

function thousandFormat(n) {
  n = Math.floor(n) // 只考虑整数

  let res = ''
  const s = n.toString()
  const length = s.length

  for (let i = length - 1; i >= 0; i--) {
    const j = length - i
    if (j % 3 === 0) {
      if (i === 0) {
        res = s[i] + res
      } else {
        res = ',' + s[i] + res
      }
    } else {
      res = s[i] + res
    }
  }

  return res
}

function thousandFormat(n) {
  n = Math.floor(n) // 只考虑整数
  if (n == 0) return '0'

  let str = ''
  while (n > 0) {
    let res = n % 1000
    n = Math.floor(n / 1000)
    if (n > 0) {
      // n > 0 非最后三位
      if (res === 0) {
        res = ',000'
      } else if (res < 10) {
        res = `,00${res}`
      } else if (res < 100) {
        res = `,0${res}`
      } else if (res < 1000) {
        res = `,${res}`
      }
    } else {
      // n <= 0 是最后三位
      res = `${res}`
    }
    str = res.concat(str)
  }

  return str
}
