function Observer(data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype = {
  constructor: Observer,
  walk: function (data) {
    var me = this;
    Object.keys(data).forEach(function (key) {
      me.convert(key, data[key]);
    });
  },
  convert: function (key, val) {
    this.defineReactive(this.data, key, val);
  },

  defineReactive: function (data, key, val) {
    var dep = new Dep();
    var childObj = observe(val);

    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function () {
        if (Dep.target) {
          dep.depend();
        }
        return val;
      },
      set: function (newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal;
        childObj = observe(newVal);
        dep.notify();
      }
    });
  }
};

function observe(value, vm) {
  if (!value || typeof value !== 'object') {
    return;
  }

  return new Observer(value);
};

/*
new vue
  observe: 每个值有一个 dep
  compile
    new Watcher 读值时触发 get
    一个 wacther 可以被多个 dep 收集
    每个 dep 里不会有相同的 watcher
 */

var uid = 0;

function Dep() {
  this.id = uid++;
  this.subs = [];
}

Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub);
  },

  depend: function () {
    Dep.target.addDep(this);
    // if (!~this.subs.indexOf(Dep.target)) {
    //   this.addSub(Dep.target);
    // }
  },

  removeSub: function (sub) {
    var index = this.subs.indexOf(sub);
    if (~index) {
      this.subs.splice(index, 1);
    }
  },

  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update();
    });
  }
};

Dep.target = null;
