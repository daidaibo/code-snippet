import { VNode, ComponentRenderProxy } from 'vue'
import { JSBridge } from '../JS-Bridge'

declare global {

  namespace JSX {
    interface Element extends VNode { }
    interface ElementClass extends ComponentRenderProxy { }
    interface ElementAttributesProperty {
      $props: any
    }
    interface IntrinsicElements {
      [elem: string]: any
    }
  }

  interface globalThis {
    _language: string
  }

  interface Window {
    JSBridge: JSBridge
    JSCallNative: { [key: string]: any }
    h5_Android: { [key: string]: any }
    webkit: {
      messageHandlers: { [key: string]: any }
    }
  }

  interface document {
    webkitHidden: boolean
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // $filters: typeof filters
    $toast: (title: string) => void
  }
}
