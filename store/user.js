export const state = () => ({
  user: null,
  token: null
})

export const getters = {
  user: state => state.user,
  token: state => state.token,
  isLoggedIn: state => state.user !== null && state.token !== null
}

export const mutations = {
  AUTH_SUCCESS(state, token) {
    state.token = token
    this.$axios.setToken(token.access_token, 'Bearer')
    this.$cookies.set('token', token)
  },
  AUTH_SIGNOUT(state) {
    state.token = null
    state.user = null
    this.$axios.setToken(false)
    this.$cookies.remove('token')
  },
  SET_USER(state, user) {
    state.user = {
      id: user.id,
      username: user.username,
      display_name: user.display_name || `unknown user`,
      avatar_url: user.avatar_url || `/images/avatar.png`,
      level: user.level,
      reputation: user.reputation,
      post_count: user.post_count,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      signature: user.signature,
      created_at: user.created_at,
      verified: user.verified
    }
  },
  UPDATE_ACCESS_TOKEN(state, token) {
    state.token.access_token = token
  },
  UPDATE_REFRESH_TOKEN(state, token) {
    state.token.refresh_token = token
  }
}

export const actions = {
  async signIn({ commit, dispatch }, { email, password }) {
    try {
      const response = await this.$authRepo.signIn(email, password)
      // if (response) {
      //   commit('AUTH_SUCCESS', response)
      //   return dispatch('fetchCurrentUser')
      // }
      return response != null
    } catch {
      return false
    }
  },
  async exchangeFBToken({ commit, dispatch, getters }, { token, expires_in }) {
    try {
      const response = await this.$socialRepo.exchangeFacebook(
        token,
        null,
        expires_in
      )
      if (response && response.access_token) {
        // commit('AUTH_SUCCESS', response)
        // const isSuccess = await dispatch('fetchCurrentUser')
        // if (isSuccess) return getters.user.verified ? 'home' : 'unverified'
        // else return null
        return response
      } else return null
    } catch {
      return null
    }
  },
  async exchangeGLToken({ commit, dispatch, getters }, token) {
    try {
      const response = await this.$socialRepo.exchangeGoogle(token)
      if (response && response.access_token) {
        // commit('AUTH_SUCCESS', response)
        // const isSuccess = await dispatch('fetchCurrentUser')
        // if (isSuccess) return getters.user.verified ? 'home' : 'unverified'
        // else return null
        return response
      } else return null
    } catch {
      return null
    }
  },
  async signUp({}, { email, password, display_name, code }) {
    try {
      const response = await this.$userRepo.createUser(
        email,
        password,
        display_name,
        code
      )
      return response != null
    } catch {
      return false
    }
  },
  async checkEmail({}, email) {
    try {
      const response = await this.$userRepo.checkEmail(email)
      return response != null
    } catch {
      return false
    }
  },
  async checkDisplayName({}, displayName) {
    try {
      const response = await this.$userRepo.checkDisplayName(displayName)
      return response != null
    } catch {
      return false
    }
  },
  async signOut({}, token) {
    try {
      await this.$authRepo.signOut(token)
      return true
    } catch {
      return false
    }
  },
  async fetchCurrentUser({ commit }) {
    try {
      const response = await this.$userRepo.getCurrentUser()
      if (response) commit('SET_USER', response.data)
      return response != null
    } catch {
      return false
    }
  },
  async verifyAccount({ commit }, code) {
    try {
      // sign out.
      commit('AUTH_SIGNOUT')
      // confirm e-mail.
      const response = await this.$userRepo.verifyAccount(code)
      return response != null
    } catch {
      return false
    }
  },
  async verifyEmail({ commit }, code) {
    try {
      // sign out.
      commit('AUTH_SIGNOUT')
      // confirm e-mail.
      const response = await this.$userRepo.verifyEmail(code)
      return response != null
    } catch {
      return false
    }
  },
  async sendVerificationEmail() {
    try {
      const response = await this.$userRepo.sendVerificationEmail()
      return response != null
    } catch {
      return false
    }
  },
  async sendResetPasswordEmail({}, { username, email }) {
    try {
      const response = await this.$userRepo.sendResetPasswordEmail(
        username,
        email
      )
      return response != null
    } catch {
      return false
    }
  },
  async resetPassword({}, { code, password }) {
    try {
      const response = await this.$userRepo.resetPassword(code, password)
      return response != null
    } catch {
      return false
    }
  },
  async updateAvatar({ commit }, { userId, file }) {
    try {
      const response = await this.$userRepo.updateAvatar(userId, file)
      if (response) commit('SET_USER', response.data)
      return response != null
    } catch {
      return false
    }
  },
  async updateUser({ commit }, { userId, user }) {
    try {
      const response = await this.$userRepo.updateUser(userId, user)
      if (response) commit('SET_USER', response.data)
      return response != null
    } catch {
      return false
    }
  },
  async updateEmail({}, { username, password, email }) {
    try {
      // request permission.
      const permission = await this.$authRepo.requestPermission(
        username,
        password,
        'change_email'
      )
      // update email
      const response = await this.$userRepo.updateEmail(
        permission.access_token,
        email
      )
      return response != null
    } catch {
      return false
    }
  },
  async updatePassword({}, { username, password, newPassword }) {
    try {
      // request permission.
      const permission = await this.$authRepo.requestPermission(
        username,
        password,
        'change_email'
      )
      // update email
      const response = await this.$userRepo.updatePassword(
        permission.access_token,
        newPassword
      )
      return response != null
    } catch {
      return false
    }
  }
}
