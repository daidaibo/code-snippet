class EventBus {
  private events: {
    [key: string]: Array<{ fn: Function, isOnce: boolean }>
  }

  constructor() {
    this.events = {}
  }

  on(type: string, fn: Function, isOnce: boolean = false) {
    const events = this.events
    events[type] = events[type] || []
    events[type].push({ fn, isOnce })
  }

  once(type: string, fn: Function) {
    this.on(type, fn, true)
  }

  off(type: string, fn?: Function) {
    if (!fn) {
      this.events[type] = []
    } else {
      const fnList = this.events[type]
      if (fnList) {
        this.events[type] = fnList.filter(item => item.fn !== fn)
      }
    }
  }

  emit(type: string, ...args: any[]) {
    const fnList = this.events[type]
    if (!fnList) return

    this.events[type] = fnList.filter(item => {
      const { fn, isOnce } = item
      fn(...args)
      return !isOnce
    })
  }
}

const Vue = function () { }

Vue.prototype.$bus = new EventBus()


Vue.prototype.$dispatch = function (eventName, data) {
  let parent = this.$parent
  while (parent) {
    parent.$emit(eventName, data)
    parent = parent.$parent
  }
}

Vue.prototype.$boardcast = function (eventName, data) {
  boardcast.call(this, eventName, data)
}
function boardcast(eventName, data) {
  this.$children.forEach(child => {
    child.$emit(eventName, data)
    if (child.$children.length) {
      boardcast.call(child, eventName, data)
    }
  })
}
