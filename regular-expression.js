/* 驼峰命名 */
function humpNaming(str) {
  str = str || 'get-element-by-id'

  return str.replace(/-\w/g, function (x) {
    return x.slice(1).toUpperCase()
  })
}

/* 模板字符串 */
function templateString(template, data) {
  template = template || '我是{{name}}，年龄{{age}}，性别{{sex}}'
  data = data || {
    name: '姓名',
    age: 18
  }

  const reg = /\{\{(\w+)\}\}/
  if (reg.test(template)) {
    const name = reg.exec(template)[1]
    template = template.replace(reg, data[name])
    return templateString(template, data)
  }
  return template
}

/* 千分位 */
function thousandFormat(n) {
  n = Math.floor(n) // 只考虑整数

  n = n.toString()

  n.replace(/(?=(?!\b)(\d{3})+$)/g, ',')
  n.replace(/\d(?=(\d{3})+$)/g, '$&,')
}

function getUrlQuery(name) {
  try {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = window.location.search.substr(1).match(reg)
    return r == null ? '' : decodeURIComponent(r[2])
  } catch (e) {
    return ''
  }
}

function parseUrl(url, isScheme = false) {
  let regexp = isScheme ? /^(wawotv:\/\/)([^:/?#]*)(\?[^#]*)?$/ :
    /^(https?:\/\/)?([^:/?#]+)(?::(\d+))?(\/[^?#]*)?(\?[^#]*)?(#.*)?$/

  const match = url.match(regexp) || []

  return isScheme ? {
    protocol: match[1],
    path: '/' + match[2],
    search: match[3]
  } : {
    protocol: match[1], // 协议 https://
    host: match[2], // 主机名 example.com
    port: match[3], // 端口 8080
    path: match[4], // 路径 /path/name
    search: match[5], // ?
    hash: match[6] // #
  }
}
