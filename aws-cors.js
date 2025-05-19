// Amazon S3 存储桶
[
  {
    "AllowedHeaders": [
      "Origin"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD"
    ],
    "AllowedOrigins": [
      "https://wawotv.com",
      "https://www.wawotv.com",
      "https://admin.dreamemovie.com",
      "https://app-admin.dreamemovie.com",
      "https://admin.wawotv.com",
      "https://app-admin.wawotv.com",
      "http://localhost:3000",
      "http://172.28.51.18:3000",
      "http://127.0.0.1:8080"
    ],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 60
  }
]

/*
  https://aws.amazon.com/cn/blogs/china/several-solutions-to-cloudfront-cross-domain-problem-cors/
*/

// Cloudfront Function 查看器响应
function handler(event) {// ForceCORSHeaders
  var origin = event.request.headers.origin || { value: '' }
  var ua = event.request.headers['user-agent'] || { value: '' }
  var sfd = event.request.headers['sec-fetch-dest'] || { value: '' }

  var response = event.response
  var headers = response.headers

  const allowedOrigins = [
    "https://wawotv.com",
    "https://www.wawotv.com",
    "https://admin.dreamemovie.com",
    "https://app-admin.dreamemovie.com",
    "https://admin.wawotv.com",
    "https://app-admin.wawotv.com",
    "http://localhost:3000",
    "http://172.28.51.18:3000",
    "http://127.0.0.1:8080"
  ]

  if (!headers['access-control-allow-origin']) {
    headers['access-control-allow-methods'] = { value: 'GET, HEAD, OPTIONS' }
  }

  if (sfd.value === 'video') {
    const _origin = origin.value
    if (_origin) {
      if (allowedOrigins.includes(_origin)) {
        headers['access-control-allow-origin'] = { value: _origin }
        headers['access-control-allow-credentials'] = { value: 'true' }
      } else {
        event.response.statusCode = 403
      }
    } else if (!/(uni-app|ijkplayer)/.test(ua.value)) {
      event.response.statusCode = 403
    }
  }

  // headers['x-my-response'] = { value: JSON.stringify(event.response) }
  // headers['x-my-request'] = { value: JSON.stringify(event.request) }

  return response
}
