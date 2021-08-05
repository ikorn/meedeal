export default async function({ store, app }) {
  console.log('auth executed')
  if (!app.$auth.loggedIn) {
    return
  }

  const auth = app.$auth

  const authStrategy = auth.strategy.name
  if (authStrategy === 'facebook' || authStrategy === 'google') {
    try {
      const token = auth.getToken(authStrategy).substr(7)
      const convertedToken =
        authStrategy === 'facebook'
          ? await store.dispatch('user/exchangeFBToken', {
              token: token,
              expire_in: ''
            })
          : await store.dispatch('user/exchangeGLToken', token)
      auth.setToken('local', 'Bearer ' + convertedToken.access_token)
      setTimeout(async () => {
        auth.setStrategy('local')
        setTimeout(async () => {
          await auth.fetchUser()
        })
      })
    } catch (e) {
      console.error(e)
    }
  }
}
