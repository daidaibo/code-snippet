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

export { }
