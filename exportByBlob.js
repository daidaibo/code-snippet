async function exportByBlob(q, defaultName = 'file') {
  try {
    const response = await axios({
      ...q,
      responseType: 'blob'
    })

    // 检查响应类型
    const contentType = response.headers['content-type']
    if (contentType.includes('application/json')) {
      const e = JSON.parse(await response.data.text())
      throw e
    }

    // 解析文件名
    const disposition = response.headers['content-disposition']
    let fileName = defaultName
    if (disposition) {
      let r = disposition.match(/filename\*=utf-8''([^;]+)/i)
      if (r && RegExp.$1) {
        fileName = RegExp.$1
      } else {
        r = disposition.match(/filename="?([^;"']+)"?/i)
        if (r && RegExp.$1) {
          fileName = RegExp.$1
        }
      }
    }

    // 下载文件
    const blob = new Blob([response.data], { type: contentType })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = decodeURIComponent(fileName).trim()
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  } catch (e) {
    console.warn(e)
    throw e
  }
}