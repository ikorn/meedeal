<template>
  <v-card flat>
    <v-card-title class="display-1">Verify e-mail address.</v-card-title>
    <v-divider />
    <v-card-text>
      Please verify your email to activate account.
      <br />Click "Send e-mail" button to send verification e-mail to your e-mail address.
      Then follow instruction in the e-mail to continue.
    </v-card-text>
    <v-card-actions>
      <v-btn @click="executeSendEmail" color="blue">Send e-mail</v-btn>
    </v-card-actions>
    <v-snackbar v-model="showError" right color="red" timout="500">Error occurs, please try again.</v-snackbar>
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      showError: false
    }
  },
  methods: {
    ...mapActions('user', ['sendVerificationEmail']),
    async executeSendEmail() {
      const isSuccess = this.sendVerificationEmail()
      if (isSuccess) this.$router.push(this.localePath({ name: 'index' }))
      else this.showError = true
    }
  }
}
</script>
