const throttle = {
  bind: function (el, { value: { fn, event, time } }) {
    if (typeof fn !== 'function') return

    el._flag = true
    el._timer = null

    el.handler = function () {
      if (!el._flag) return
      fn()
      el._flag = false
      if (el._timer) {
        clearTimeout(el._timer)
        el._timer = null
      }
      el._timer = setTimeout(() => {
        el._flag = true
      }, time)
    }

    el.event = event
    el.addEventListener(el.event, el.handler)
  },
  unbind: function (el) {
    el.removeEventListener(el.event, el.handler)
  }
}

export default throttle
