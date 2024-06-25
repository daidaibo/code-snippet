const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio')
const superagent = require('superagent')
const cliProgress = require('cli-progress')

const bar = new cliProgress.SingleBar({
  clearOnComplete: false
}, cliProgress.Presets.shades_classic)

const header = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'zh-CN,zh;q=0.9',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

function request(url) {
  return new Promise((resolve, reject) => {
    superagent.get(url)
      .set('Accept', header['Accept'])
      .set('Accept-Encoding', header['Accept-Encoding'])
      .set('Accept-Language', header['Accept-Language'])
      .set('Cache-Control', header['Cache-Control'])
      .set('Connection', header['Connection'])
      .set('Sec-Ch-Ua', header['Sec-Ch-Ua'])
      .set('User-Agent', header['User-Agent'])
      .end(async (err, res) => {
        if (err) {
          return reject(err)
        }
        resolve(res)
      })
  })
}

function runImage(keyWord) {
  // const word = encodeURIComponent('柯基')
  // https://image.baidu.com/search/index?tn=baiduimage&word=%E6%9F%AF%E5%9F%BA
  const word = encodeURIComponent(keyWord)
  request(`http://image.baidu.com/search/index?tn=baiduimage&word=${word}`)
    .then(async (res, err) => {
      if (err) {
        return console.error(err)
      }

      const html = res.text
      // const $ = cheerio.load(html)
      // $('meta').each((index, elem) => {
      //   console.log(`${index}. ${$(elem).attr('name')}: ${$(elem).attr('content')}`)
      // })

      const imageMatches = html.match(/"objURL":"(.*?)"/g)
      const images = imageMatches.map(item => {
        item.match(/:"(.*?)"/)
        return RegExp.$1
      })
      // console.log(images)

      const titleMatches = html.match(/"fromPageTitle":"(.*?)"/g)
      // console.log(titleMatches)
      const titles = titleMatches.map(item => {
        item.match(/:"(.*?)"/)
        return RegExp.$1
      })

      console.log(images.length, titles.length)

      try {
        bar.start(images.length, 0)
        await mkImageDir('images')
        await downloadImage(images[0], titles[0], 0)
        bar.update(images.length / 2)
        setTimeout(() => {
          bar.update(images.length)
          bar.stop()
        }, 2000)
      } catch (e) {

      }
    })
}

function mkImageDir(pathname) {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(__dirname, pathname)
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, {
        force: true,
        recursive: true
      })
      // const progress = require('child_process')
      // progress.execSync(`rm -rf ${fullPath}`)
    }
    fs.mkdirSync(fullPath)
    resolve()
  })
}

function downloadImage(url, name, index) {
  return new Promise((resolve, reject) => {
    name = `${index + 1}.${name}.png`
    const fullPath = path.join(__dirname, 'images', name)

    superagent.get(url).end((err, res) => {
      if (err) {
        resolve()
        return console.error(err)
      }

      if (JSON.stringify(res.body) === '{}') {
        resolve()
        console.warn(`第${index + 1}张图片内容为空`)
      }

      fs.writeFile(fullPath, res.body, 'binary', err => {
        if (err) {
          resolve()
          console.error(`第${index + 1}张图片下载失败：${err}`)
        }
        resolve()
        // console.log(name)
      })
    })
  })
}

module.exports = {
  runImage
}
