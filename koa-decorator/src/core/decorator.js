export const RequestMethod = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
  OPTIONS: 'options'
}

export const controllers = []

export function Controller(prefix = '') {
  return function (target) {
    target.prefix = prefix
  }
}

export function RequestMapping(method = RequestMethod.GET, url = '') {
  return function (target, name, descriptor) {
    let path = url || `/${name}`
    controllers.push({
      url: path,
      method,
      handler: target[name],
      constructor: target.constructor
    })
  }
}
