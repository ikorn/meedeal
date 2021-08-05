<template>
  <v-card>
    <v-card-title class="display-1">Reset password.</v-card-title>
    <v-divider />
    <v-card-text>
      Please input your new password, and click "Send Confirm E-mail" button to request confirm e-mail.
      <br />Then follow instruction in the e-mail to continue.
    </v-card-text>
    <v-card-text class="pt-0">
      <ValidationProvider name="password" rules="required|min:6" v-slot="{ errors, valid }">
        <v-text-field
          type="password"
          v-model="password"
          :error-messages="errors"
          :success="valid"
          label="Password"
          ref="password"
          required
        />
      </ValidationProvider>
      <ValidationProvider
        name="password"
        rules="required|min:6|confirmed:password"
        v-slot="{ errors, valid }"
      >
        <v-text-field
          type="password"
          v-model="confirmPassword"
          :error-messages="errors"
          :success="valid"
          label="Confirm password"
          required
        />
      </ValidationProvider>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn @click="executeUpdate" class="blue white--text text-none">Send Confirm E-mail</v-btn>
    </v-card-actions>
    <v-snackbar v-model="showError" right color="red" timout="500">Error occurs, please try again.</v-snackbar>
  </v-card>
</template>
<script>
import { mapActions } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
export default {
  layout: 'preauth',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  validate({ query }) {
    return query['code'] != null
  },
  async asyncData({ store }) {
    await store.dispatch('user/signout')
  },
  data() {
    return {
      password: '',
      confirmPassword: '',
      showError: false
    }
  },
  methods: {
    ...mapActions('user', ['resetPassword']),
    async executeUpdate() {
      const isValid = await this.$validator.validateAll()
      if (isValid) {
        const isSuccess = await this.resetPassword({
          code: this.$route.query['code'],
          password: this.password
        })
        if (isSuccess)
          this.$router.push(this.localePath({ name: 'users-signin' }))
        else this.showError = true
      }
    }
  }
}
</script>