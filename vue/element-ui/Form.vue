<template>
  <form>
    <slot></slot>
  </form>
</template>

<script>
export default {
  provide() {
    return {
      form: this
    }
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: {
      type: Object
    }
  },
  methods: {
    validate(cb) {
      // 调用所有含有 prop 属性的子组件的 validate 方法
      let count = 0
      const tasks = this.$children.filter(item => item.prop)

      tasks.map(item => item.validate(error => {
        if (!error) {
          count += 1
        }
      }))

      if (count == tasks.length) {
        cb(true)
      } else {
        cb(false)
      }
    }
  }
}
</script>

<style scoped></style>