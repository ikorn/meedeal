<template>
  <v-card>
    <v-card-title class="display-1">{{$t('pages.sign_in.title')}}</v-card-title>
    <v-divider />
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <ValidationProvider name="email" rules="required|email" v-slot="{ errors, valid }">
              <v-text-field
                v-model="email"
                :error-messages="errors"
                :success="valid"
                :label="$t('user.email')"
                required
              />
            </ValidationProvider>
            <ValidationProvider name="password" rules="required|min:6" v-slot="{ errors, valid }">
              <v-text-field
                type="password"
                v-model="password"
                :error-messages="errors"
                :success="valid"
                :label="$t('user.password')"
                required
              />
            </ValidationProvider>
            <v-checkbox
              v-model="keep"
              color="green"
              :label="$t('pages.sign_in.keep')"
              class="my-0 py-0"
            />
            <v-btn
              @click="executeLogin"
              color="blue white--text text-none"
              block
            >{{$t('pages.sign_in.submit')}}</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center">
            <h3 class="black--text mb-3">{{$t('pages.sign_in.trouble')}}</h3>
            <v-btn
              :to="localePath({ name: 'users-forgot-request' })"
              color="orange"
              text
              small
              class="text-none"
            >{{$t('pages.sign_in.forgot')}}</v-btn>|
            <v-btn
              :to="localePath({ name: 'users-signup' })"
              nuxt
              color="green"
              text
              small
              class="text-none"
            >{{$t('pages.sign_in.sign_up')}}</v-btn>
          </v-col>
        </v-row>
        <v-divider />
        <v-row>
          <v-col class="text-center">
            <h3 class="black--text mb-3">{{$t('pages.sign_in.social')}}</h3>
            <v-btn @click="executeFacebookLogin" color="blue darken-4" icon small>
              <v-icon small>fa-facebook</v-icon>
            </v-btn>
            <v-btn @click="executeGoogleLogin" color="red darken-4" icon small>
              <v-icon small>fa-google</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn
        :to="localePath({ name: 'index' })"
        nuxt
        exact
        text
        small
        color="green"
        class="text-none mt-2"
      >
        <v-icon small left>fa-chevron-left</v-icon>
        {{$t('button.home')}}
      </v-btn>
    </v-card-actions>
    <v-snackbar
      v-model="showError"
      right
      color="error"
      timout="500"
    >Error occured while sign in. Please try again.</v-snackbar>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
export default {
  layout: 'preauth',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      email: '',
      password: '',
      keep: false,
      showError: false,
      googleSignInParams: {
        client_id:
          '760383399648-4ea9vg08ovpf0rol3up9i2qtjhp4u5u6.apps.googleusercontent.com'
      }
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  methods: {
    ...mapActions('user', ['signIn', 'exchangeFBToken', 'exchangeGLToken']),
    async executeLogin() {
      this.$store.dispatch('setRememberMe', this.keep)
      const isValid = await this.$validator.validateAll()
      if (isValid) {
        try {
          await this.$auth.loginWith('local', {
            data: {
              grant_type: `password`,
              username: this.email,
              password: this.password,
              client_id: process.env.clientId
            }
          })
          this.verifyUser()
        } catch (e) {
          this.showError = true
        }
      }
    },
    async executeFacebookLogin() {
      try {
        await this.$auth.loginWith('facebook')
        this.verifyUser()
      } catch {
        this.showError = true
      }
    },
    async executeGoogleLogin() {
      try {
        await this.$auth.loginWith('google')
        this.verifyUser()
      } catch {
        this.showError = true
      }
    },
    verifyUser() {
      if (this.$auth.user.verified)
        this.$router.push(this.localePath({ name: 'index' }))
      else this.$router.push(this.localePath({ name: 'users-unverified' }))
    }
  }
}
</script>