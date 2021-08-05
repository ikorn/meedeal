<template>
  <v-dialog v-model="showDialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" small icon color="orange">
        <v-icon small>fa-edit</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Update E-mail</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          name="email"
          type="email"
          label="Current e-mail"
          v-model="user.email"
          readonly
          disabled
        />
        <v-text-field
          name="email"
          type="email"
          label="new e-mail"
          ref="email"
          required
          v-model="newEmail"
          v-validate="'required|email'"
          data-vv-as="new e-mail"
          :error-messages="errors.collect('newEmail')"
        />
        <v-text-field
          name="confirmEmail"
          type="email"
          label="Confirm e-mail"
          required
          v-model="confirmEmail"
          v-validate="'required|email|confirmed:email'"
          data-vv-as="confirm e-mail"
          :error-messages="errors.collect('confirmEmail')"
        />
        <v-text-field
          name="password"
          type="password"
          label="Password"
          required
          v-model="password"
          v-validate="'required|min:6'"
          data-vv-as="password"
          :error-messages="errors.collect('password')"
        />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue white--text" small @click="executeUpdate">Update</v-btn>
      </v-card-actions>
      <v-snackbar
        v-model="showError"
        right
        color="error"
        timout="500"
      >Error occured. Please try again.</v-snackbar>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
  },
  data() {
    return {
      email: null,
      newEmail: null,
      confirmEmail: null,
      password: null,
      showDialog: false,
      showError: false
    }
  },
  methods: {
    ...mapActions('user', ['updateEmail']),
    async executeUpdate() {
      const isValid = await this.$validator.validateAll()
      if (isValid) {
        const isSuccess = await this.updateEmail({
          username: this.user.username,
          password: this.password.trim(),
          email: this.newEmail
        })
        if (isSuccess) {
          // clear form.
          this.newEmail = null
          this.confirmEmail = null
          this.password = null
          this.showDialog = false
        } else {
          this.showError = true
        }
      }
    }
  }
}
</script>