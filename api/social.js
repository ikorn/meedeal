export default $axios => ({
  exchangeFacebook(token, token_type, expires_in) {
    var path = `users/fb/exchange?access_token=${token}`
    if (token_type) path += `&token_type=${token_type}`
    if (expires_in) path += `&expires_in=${expires_in}`
    return $axios.get(path)
  },
  exchangeGoogle(token) {
    return $axios.get(`users/gl/exchange/?access_token=${token}`)
  }
})
