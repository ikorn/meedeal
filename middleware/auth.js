export default function({ store, redirect, route }) {
  /*
    if (!store.getters['user/isLoggedIn']) {
        return redirect('/user/signin')
    }*/
  if (!store.state.auth.loggedIn) {
    return redirect('user/signin')
  }
  return Promise.resolve()
}
