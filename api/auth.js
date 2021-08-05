export default $axios => ({
  signIn(username, password) {
    return $axios.post(`o/token/`, {
      grant_type: `password`,
      username: username,
      password: password,
      client_id: process.env.clientId
    })
  },
  refreshToken(refreshToken) {
    return $axios.post(`o/token/`, {
      grant_type: `refresh_token`,
      refresh_token: refreshToken,
      client_id: process.env.clientId
    })
  },
  requestPermission(username, password, scope) {
    return $axios.post(`o/token/`, {
      grant_type: `password`,
      username: username,
      password: password,
      client_id: process.env.clientId,
      scope: scope
    })
  },
  signOut(token) {
    return $axios.post(`o/revoke_token/`, {
      token: token,
      client_id: process.env.clientId
    })
  }
})
