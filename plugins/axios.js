export default function({ app: { $axios, redirect } }) {
  $axios.defaults.baseURL = process.env.apiBaseUrl
  $axios.defaults.browserBaseURL = '/api/'
  $axios.onRequest(config => {
    config.headers.common.Accept = 'application/json'
    config.headers.common['Content-Type'] = 'application/json'
    config.headers['Access-Control-Allow-Origin'] = '*'
    console.log(`making request to ${process.env.apiBaseUrl}${config.url}`)
    console.log(config.headers)
    return config
  })
  $axios.onError(error => {
    console.log(
      `[${error.response && error.response.status}] ${error.response &&
        error.response.request.path} : ${error.response}`
    )
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })
  $axios.onResponse(response => {
    console.log(response.data)
  })
}
