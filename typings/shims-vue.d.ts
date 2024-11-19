import type { IFilters } from '~/plugins/filters'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.scss'
declare module '*.png'

declare module '#app' {
  interface NuxtApp {
    $filters: IFilters
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $filters: IFilters
  }
}

// 在 src 目录下创建 shims.d.ts 文件
// declare module 'vue/types/vue' {
//   interface Vue {
//     $filters: IFilters
//   }
// }

export { }
