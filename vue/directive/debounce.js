const debounce = {
  inserted: function (el, { value: { fn, event, time } }) {
    if (typeof fn !== 'function') return
    el._timer = null
    el.addEventListener(event, () => {
      if (el._timer) {
        clearTimeout(el._timer)
        el._timer = null
      }
      el._timer = setTimeout(() => {
        fn()
      }, time)
    })
  }
}

// <input v-debounce="{fn, event: 'input', time: 500}" />

export default debounce
