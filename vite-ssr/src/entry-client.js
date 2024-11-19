import { createApp } from './main'

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
  // 添加路由钩子函数，用于处理 asyncData.
  // 在初始路由 resolve 后执行，
  // 以便我们不会二次预取(double-fetch)已有的数据。
  // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
  router.beforeResolve(async (to, from, next) => {
    const toComponents = router.resolve(to).matched.flatMap(record =>
      Object.values(record.components)
    )
    const fromComponents = router.resolve(from).matched.flatMap(record =>
      Object.values(record.components)
    )

    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false
    const activated = toComponents.filter((c, i) => {
      return diffed || (diffed = (fromComponents[i] !== c))
    })

    next()

    if (activated.length) {
      await Promise.all(activated.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      }))
    }

  })

  app.mount('#app')

  console.log('hydrated')
})