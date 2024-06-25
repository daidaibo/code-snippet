export default class DB {
  private dbName: string
  private db: any

  constructor(dbName: string) {
    this.dbName = dbName
  }

  public openDBAndInitStore(storeName: string, keyPath: string, indexs?: string[]) {
    return new Promise((resolve, reject) => {

      const request = window.indexedDB.open(this.dbName, 1)

      request.onsuccess = (event) => {
        const { result }: any = event.target
        this.db = result
        resolve(result)
      }

      request.onerror = (event) => {
        reject(event)
      }

      request.onupgradeneeded = (event) => {
        const { result: db }: any = event.target

        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, { keyPath, autoIncrement: true })

          indexs?.map(v => {
            store.createIndex(v, v, { unique: true })
          })

          store.transaction.oncomplete = (event: any) => {

          }
        }
      }
    })
  }

  public updateItem(storeName: string, data: any) {
    const store = this.db.transaction([storeName], 'readwrite').objectStore(storeName)

    const request = store.put({
      ...data,
      updateTime: new Date().getTime()
    })
    request.onsuccess = () => {

    }

    // data.forEach((item) => {
    //   store.put(item)
    // })
  }

  public deleteItem(storeName: string, key: number | string) {
    const store = this.db.transaction([storeName], 'readwrite').objectStore(storeName)

    const request = store.delete(key)
    request.onsuccess = () => {

    }
  }

  public getList(storeName: string) {
    const store = this.db.transaction(storeName).objectStore(storeName)

    const request = store.getAll()

    return new Promise((resolve, reject) => {
      request.onsuccess = (event: any) => {
        resolve(event.target.result)
      }
    })
  }

  public getItem(storeName: string, key: number | string) {
    const store = this.db.transaction(storeName).objectStore(storeName)

    const request = store.get(key)
    request.onsuccess = (event: any) => {
      console.log(event.target.result)
    }
  }
}

const airbnbDB = new DB('airbnb')
airbnbDB.openDBAndInitStore('elephant', 'id', ['name'])
  .then(() => {
    airbnbDB.updateItem('elephant', {
      id: '',
      name: 'Power Gem',
      color: 'brown',
      sex: 'man'
    })
  })

// Mock 接口
async function fetchElephant() {
  const data = await airbnbDB.getList('elephant')
  console.log(data)
}
