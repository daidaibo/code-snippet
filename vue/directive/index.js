import debounce from './debounce'
import throttle from './throttle'

const directives = {
  debounce,
  throttle
}

export default {
  install(Vue) {
    Object.keys(directives).forEach(key => {
      Vue.directives(key, directives[key])
    })
  }
}
