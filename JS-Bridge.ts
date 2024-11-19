interface IDevice {
  isAndroid: boolean;
  isIOS: boolean;
}

function getDevice() {
  const u = navigator.userAgent
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

  return {
    isAndroid,
    isIOS
  }
}

interface IRegisterParams {
  method: string;
  callback: (...args: any[]) => any;
}

interface IInvokeParams {
  method: string;
  data?: { [key: string]: any; };
  callback?: (params?: any) => void;
  // ios 原生支持直接使用对象传参 flutter 不支持使用对象传参数
  iosIsJson?: boolean;
}

interface IReceiveMessageParams {
  cbKey: string;
  data?: { [key: string]: any; };
}

interface JSBridgeConstructor {
  device: IDevice | null;
  register(data: IRegisterParams): void;
  invoke(data: IInvokeParams): void;
  receiveMessage(data: IReceiveMessageParams): void;
  remove(cbKey: string): void;
}

export class JSBridge implements JSBridgeConstructor {
  // 自增 id 防止重名
  private id = 0

  private callbacks = {} as Record<string, (...args: any[]) => void>

  private registerCallbacks = {} as Record<string, (...args: any[]) => void>

  device: IDevice | null = getDevice()

  register = ({ method, callback }: IRegisterParams) => {
    this.registerCallbacks[method] = callback
  }

  invoke = ({ method, data = {}, callback, iosIsJson = false }: IInvokeParams) => {
    this.id += 1
    const cbKey = `${method}-${this.id}`

    let pendingResolved = async (_res: any) => { }
    const pendingPromise: Promise<any> = new Promise(resolved => {
      pendingResolved = async (res) => {
        callback && await callback(res)
        resolved(res)
      }
    })

    this.callbacks[cbKey] = pendingResolved

    const params = {
      method,
      data,
      cbKey
    }

    try {
      if (this.device?.isAndroid) {
        // window.JSCallNative?.postMessage(params)
        window?.h5_Android[method](JSON.stringify(params))
      } else if (this.device?.isIOS) {
        // window.webkit?.messageHandlers.JSCallNative.postMessage(params)
        window?.webkit?.messageHandlers[method].postMessage(iosIsJson ? JSON.stringify(params) : params)
      }
    } catch (error) {
      console.log(error)
    }

    return pendingPromise
  }

  receiveMessage = ({ cbKey, data }: IReceiveMessageParams) => {
    if (this.callbacks[cbKey]) {
      this.callbacks[cbKey](data)
      this.remove(cbKey)
    } else if (this.registerCallbacks[cbKey]) {
      this.registerCallbacks[cbKey](data)
    }
  }

  remove = (method: string) => {
    delete this.registerCallbacks[method]
  }
}

export const JSBridgeInstance = new JSBridge()
window.JSBridge = JSBridgeInstance

/*
  主动调用 Native 方法
  JSBridgeInstance.invoke({
    method: '',
    data: {},
    callback: (res) => {
      console.log(res)
    }
  })

  注册方法 Native 调用
  JSBridgeInstance.register({
    method: '',
    callback: (res) => {
      console.log(res)
    }
  })
*/