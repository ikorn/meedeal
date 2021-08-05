<template>
  <v-card>
    <v-card-title class="display-1">Forgot Password.</v-card-title>
    <v-divider />
    <v-card-text>
      Please input your user name or e-mail address, and click "Send Email" button to request reset password e-mail.
      <br />Then follow instruction in the e-mail to continue.
    </v-card-text>
    <v-card-text class="pt-0">
      <ValidationProvider name="username" rules="min:3" v-slot="{ errors, valid }">
        <v-text-field
          type="text"
          label="User name"
          v-model="username"
          :error-messages="errors"
          :success="valid"
        />
      </ValidationProvider>
      <ValidationProvider name="email" rules="email" v-slot="{ errors, valid }">
        <v-text-field
          type="email"
          label="E-mail"
          v-model="email"
          :error-messages="errors"
          :success="valid"
        />
      </ValidationProvider>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn
        :to="localePath({ name:'users-signin' })"
        text
        small
        color="green"
        class="text-none mt-2"
      >
        <v-icon small left>fa-chevron-left</v-icon>Back to Sign-in
      </v-btn>
      <v-spacer />
      <v-btn @click="executeRequest" color="blue white--text text-none">Send E-mail</v-btn>
    </v-card-actions>
    <v-snackbar
      v-model="showError"
      right
      color="red"
      timout="500"
    >Error occurs while sign in. Please try again.</v-snackbar>
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
  data() {
    return {
      username: null,
      email: null,
      showError: false
    }
  },
  methods: {
    ...mapActions('user', ['sendResetPasswordEmail']),
    async executeRequest() {
      if (!this.username && !this.email) {
        this.$validator.errors.add({
          field: 'username',
          msg: 'Please input user name or e-mail address.'
        })
      } else {
        const isValid = await this.$validator.validateAll()
        if (isValid) {
          const isSuccess = await this.sendResetPasswordEmail({
            username: this.username,
            email: this.email
          })
          if (isSuccess)
            this.$router.push(this.localePath({ name: 'users-signin' }))
          else this.showError = true
        }
      }
    }
  }
}
</script>
