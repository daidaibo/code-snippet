const { createApp, ref, computed } = Vue
const { Buffer, urllib } = OSS
var OSS = OSS.Wrapper

var parseContentType = () => {
  return {
    type: 'application/json'
  }
}

const statusMap = {
  success: 1,
  fail: 2,
  process: 3,
  waiting: 4
}

const statusDesc = {
  [statusMap.success]: '上传成功',
  [statusMap.fail]: '上传失败',
  [statusMap.process]: '上传中',
  [statusMap.waiting]: '待上传'
}

const statusCls = {
  [statusMap.success]: 'success',
  [statusMap.fail]: 'fail',
  [statusMap.process]: 'process',
  [statusMap.waiting]: 'waiting'
}

createApp({
  setup() {
    // https://www.alibabacloud.com/help/zh/oss/developer-reference/browser-js/
    const client = new OSS({
      region: '',
      accessKeyId: '',
      accessKeySecret: '',
      bucket: '',
      endpoint: ''
    })

    const listRef = ref()
    const renderList = ref([])
    const confirmList = ref([])

    const fileChange = async (e) => {
      const files = e.target.files
      console.log(files)

      const _list = Array.from(files)
        // .filter(file => !isNaN(file.name.split('.')[0]))
        .map((file) => {
          return {
            file,
            name: file.name,
            size: filterSize(file.size),
            status: statusMap.waiting,
            progress: '0.00%',
            running: false,
            retry: 0,
            checkpoint: null
          }
        })
      renderList.value = [
        ...renderList.value,
        ..._list
      ]
      confirmList.value = [
        ...confirmList.value,
        ..._list
      ]

      await Vue.nextTick()
      listRef.value?.scrollTo(0, listRef.value.scrollHeight)
    }

    const limitPromiseRun = (item) => {
      const limitPromise = LimitPromise.getInstance()

      item.status = statusMap.process
      limitPromise.run(() => {
        item.running = true
        const file = item.file
        return calculateMD5(file)
          .then(md5 => {
            const key = `wz/sv/${md5.slice(0, 1)}/${md5.slice(1, 2)}/${md5}.mp4`
            return multipartUpload(item, key, file)
          })
          // .then(() => {
          //   item.status = statusMap.success
          // })
          .then(function (r) {
            return urllib.request(`${location.origin}/api`, {
              method: 'POST',
              data: {
                series_id: new URLSearchParams(location.search).get('series_id'),
                series_no: parseInt(item.file.name),
                origin_video_v2: r.name,
                video_size: item.file.size
              },
              headers: {
                'Content-Type': 'application/json'
              }
            })
          })
          .then(function ({ data }) {
            const { code, msg } = JSON.parse(data.toString())
            if (code === 1) {
              item.status = statusMap.success
            } else {
              console.error(msg)
              item.status = statusMap.fail
            }
          })
          .catch(error => {
            console.error(error)
            item.status = statusMap.fail
          })
      })
    }

    const handleUpload = () => {
      confirmList.value.forEach(limitPromiseRun)
      confirmList.value = []
    }

    const multipartUpload = (item, key, file) => {
      const param = {
        progress: function (p, cpt) {
          return (done) => {
            item.checkpoint = cpt
            item.progress = (p * 100).toFixed(2) + '%'
            done()
          }
        },
        headers: {
          'x-oss-forbid-overwrite': 'false'
        },
        parallel: 4,
        partSize: 1024 * 1024 * 2,
        mime: 'video/mp4'
      }
      if (item.checkpoint) {
        param.checkpoint = item.checkpoint
      }
      return client.multipartUpload(key, file, param).catch(async (e) => {
        if (item.retry >= 3) {
          throw e
        }
        item.retry += 1
        console.warn(`Retry: ${item.name} 第${item.retry}次; awaiting 1s.`)
        await new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 1000)
        })
        console.warn(`Retry: ${item.name} 第${item.retry}次; awaited 1s.`)
        return multipartUpload(item, key, file)
      })
    }

    const uploadBtnActive = computed(() => !!confirmList.value.length)
    const successNum = computed(() => renderList.value.filter((item) => item.status === statusMap.success).length)
    const failNum = computed(() => renderList.value.filter((item) => item.status === statusMap.fail).length)
    const pendingNum = computed(() => renderList.value.length - successNum.value - failNum.value)

    const handleRetry = (item) => {
      item.progress = '0.00%'
      item.running = false
      limitPromiseRun(item)
    }
    const handleDelete = (item, index) => {
      renderList.value.splice(index, 1)
      const i = confirmList.value.findIndex((_item) => item === _item)
      confirmList.value.splice(i, 1)
    }

    const handleComplete = function () {
      parent.layui.table.reload('table_id')
      const index = parent.layer.getFrameIndex(window.name)
      parent.layer.close(index)
    }

    return {
      statusMap,
      statusDesc,
      statusCls,
      listRef,
      renderList,
      fileChange,
      handleUpload,
      uploadBtnActive,
      successNum,
      failNum,
      pendingNum,
      handleRetry,
      handleDelete,
      handleComplete
    }
  }
}).mount('#app')

function calculateMD5(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (event) {
      resolve(md5(event.target.result))
    }
    reader.onerror = function (error) {
      reject(error)
    }
    reader.readAsArrayBuffer(file)
  })
}

function filterSize(size) {
  if (!size) return '-'
  if (size < pow1024(1)) return size + ' B'
  if (size < pow1024(2)) return (size / pow1024(1)).toFixed(2) + ' KB'
  if (size < pow1024(3)) return (size / pow1024(2)).toFixed(2) + ' MB'
  if (size < pow1024(4)) return (size / pow1024(3)).toFixed(2) + ' GB'
  return (size / pow1024(4)).toFixed(2) + ' TB'
}

function pow1024(num) {
  return Math.pow(1024, num)
}

class LimitPromise {
  constructor(max) {
    this._max = max || 5
    this._count = 0
    this._taskQueue = []
    this.instance = null
  }

  run(caller) {
    return new Promise((resolve, reject) => {
      const task = this._createTask(caller, resolve, reject)

      if (this._count >= this._max) {
        this._taskQueue.push(task)
      } else {
        task()
      }
    })
  }

  _createTask(caller, resolve, reject) {
    return () => {
      caller().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      }).finally(() => {
        this._count--
        if (this._taskQueue.length) {
          const task = this._taskQueue.shift()
          task()
        }
      })

      this._count++
    }
  }

  static getInstance(max) {
    if (!this.instance) {
      this.instance = new LimitPromise(max)
    }
    return this.instance
  }
}
