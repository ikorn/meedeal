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
          name="currentPassword"
          type="password"
          label="Current password"
          required
          v-model="password"
          v-validate="'required|min:6'"
          data-vv-as="current password"
          :error-messages="errors.collect('currentPassword')"
        />
        <v-text-field
          name="newPassword"
          type="password"
          label="New password"
          ref="newPassword"
          required
          v-model="newPassword"
          v-validate="'required|min:6'"
          data-vv-as="new password"
          :error-messages="errors.collect('newPassword')"
        />
        <v-text-field
          name="confirmPassword"
          type="password"
          label="Confirm password"
          required
          v-model="confirmPassword"
          v-validate="'required|min:6|confirmed:newPassword'"
          data-vv-as="confirm password"
          :error-messages="errors.collect('confirmPassword')"
        />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue white--text" small @click="executeUpdate">Save</v-btn>
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
      password: null,
      newPassword: null,
      confirmPassword: null,
      showDialog: false,
      showError: false
    }
  },
  computed: {
    ...mapGetters({ user: 'user/user' })
  },
  methods: {
    ...mapActions('user', ['updatePassword']),
    async executeUpdate() {
      const isValid = await this.$validator.validateAll()
      if (isValid) {
        const isSuccess = await this.updatePassword({
          username: this.user.username,
          password: this.password.trim(),
          new_password: this.newPassword.trim()
        })
        if (isSuccess) {
          // clear form.
          this.password = ''
          this.newPassword = ''
          this.confirmPassword = ''
          this.showDialog = false
        } else {
          this.showError = true
        }
      }
    }
  }
}
</script>