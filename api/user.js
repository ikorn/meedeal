export default $axios => ({
  getCurrentUser() {
    return $axios.get(`users/current/`)
  },
  checkAvailability(username) {
    return $axios.get(`users/available/?username=${username}`)
  },
  checkEmail(email) {
    return $axios.get(`users/available/?email=${email}`)
  },
  checkDisplayName(name) {
    return $axios.get(`users/display/available/?name=${name}`)
  },
  createUser(email, password, display_name, code) {
    return $axios.post(`users/`, {
      email: email,
      password: password,
      display_name: display_name,
      code: code
    })
  },
  updateUser(userId, user) {
    return $axios.patch(`users/${userId}/`, user)
  },
  updateAvatar(userId, file) {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    const formData = new FormData()
    formData.append(`upload`, file)
    return $axios.post(`users/${userId}/avatar/`, formData, config)
  },
  deleteAvatar(path) {
    return $axios.delete(path.replace(`http://`, `https://`))
  },
  updateEmail(token, email) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    return $axios.post(`users/current/email/`, { email: email.trim() }, config)
  },
  updatePassword(token, password) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    return $axios.post(
      `users/current/password/`,
      {
        password: password
      },
      config
    )
  },
  verifyAccount(code) {
    return $axios.get(`users/confirm/?code=${code}`)
  },
  verifyEmail(code) {
    return $axios.get(`users/verify/?code=${code}`)
  },
  sendVerificationEmail() {
    return $axios.post(`users/current/resend/`)
  },
  sendResetPasswordEmail(username, email) {
    var params = {}
    if (username) params.username = username
    else params.email = email
    return $axios.post(`users/forgot/`, params)
  },
  resetPassword(code, password) {
    return $axios.post(`users/forgot/update/`, {
      code: code,
      password: password
    })
  }
})
