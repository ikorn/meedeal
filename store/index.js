export const state = () => ({
  remember_me: null,
  view_mode: 0
})

export const mutations = {
  SET_REMEMBER(state, value) {
    state.remember_me = value
    if (value == true) {
      this.$cookies.set('remember_me', value)
    } else {
      this.$cookies.remove('remember_me')
      this.$cookies.remove('token')
    }
  },
  SET_VIEW_MODE(state, mode) {
    state.view_mode = mode
    this.$cookies.set('view_mode', mode)
  }
}

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { app, req }) {
    // get categories, tags data.
    await dispatch('deals/fetchCategories')
    await dispatch('deals/fetchTags')
    // read cookies.
    var mode = app.$cookies.get('view_mode') || '0'
    commit('SET_VIEW_MODE', app.$cookies.get('view_mode') || 0)
    commit('SET_REMEMBER', app.$cookies.get('remember_me'))
    try {
      const token = app.$cookies.get('token')
      if (token) {
        commit('user/AUTH_SUCCESS', token)
        await dispatch('user/fetchCurrentUser')
      }
    } catch (e) {
      console.error(e)
    }
  },
  setViewMode({ commit }, mode) {
    commit('SET_VIEW_MODE', mode)
  },
  setRememberMe({ commit }, value) {
    commit('SET_REMEMBER', value)
  }
}

export const getters = {
  isAuthenticated: state => state.auth.loggedIn,
  loggedInUser: state => state.auth.user,
  strategy: state => state.auth.strategy,
  rememberMe: state => state.remember_me,
  viewMode: state => state.view_mode
}
