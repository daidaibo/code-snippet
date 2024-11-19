<template>
  <ul>
    <li v-for="item in notices" :key="item.id">{{ item.content }}</li>
  </ul>
</template>

<script>
let seed = 0
export default {
  data() {
    return {
      notices: []
    }
  },
  methods: {
    add(notice) {
      let id = ++seed
      this.notices.push({
        ...notice,
        id
      })
      const duration = notice.duration
      setTimeout(() => {
        this.remove(id)
      }, duration * 1000)
    },
    remove(id) {
      const notices = this.notices
      for (let i = 0; i < notices.length; i++) {
        if (notices[i].id === id) {
          this.notices.splice(i, 1)
          break
        }
      }
    }
  }
}
</script>