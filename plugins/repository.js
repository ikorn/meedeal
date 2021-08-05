import auth from '@/api/auth.js'
import deals from '@/api/deals.js'
import user from '@/api/user.js'
import social from '@/api/social.js'

export default (ctx, inject) => {
  inject('authRepo', auth(ctx.$axios))
  inject('dealRepo', deals(ctx.$axios))
  inject('userRepo', user(ctx.$axios))
  inject('socialRepo', social(ctx.$axios))
}
