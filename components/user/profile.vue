<template>
  <v-dialog v-model="showDialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" small icon color="orange">
        <v-icon small>fa-edit</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Update Profile</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          name="firstName"
          type="text"
          label="First name"
          required
          v-model="firstName"
          v-validate="'required'"
          data-vv-as="first name"
          :error-messages="errors.collect('firstName')"
        />
        <v-text-field
          name="lastName"
          type="text"
          label="Last name"
          required
          v-model="lastName"
          v-validate="'required'"
          data-vv-as="last name"
          :error-messages="errors.collect('lastName')"
        />
        <v-text-field
          name="displayname"
          type="text"
          label="Display name"
          required
          v-model="displayName"
          v-validate="'required'"
          data-vv-as="display name"
          :error-messages="errors.collect('displayname')"
        />
        <v-textarea v-model="signature" name="signature" type="text" label="Signature" />
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
      firstName: null,
      lastName: null,
      displayName: null,
      signature: null,
      showDialog: false,
      showError: false
    }
  },
  computed: {
    ...mapGetters({ user: 'user/user' })
  },
  methods: {
    ...mapActions('user', ['updateUser']),
    async executeUpdate() {
      const isValid = await this.$validator.validateAll()
      if (isValid) {
        const isSuccess = await this.updateUser({
          userId: this.user.id,
          user: {
            first_name: this.firstName ? this.firstName.trim() : null,
            last_name: this.lastName ? this.lastName.trim() : null,
            display_name: this.displayName ? this.displayName.trim() : null,
            signature: this.signature ? this.signature.trim() : null
          }
        })
        if (isSuccess) {
          this.firstName = null
          this.lastName = null
          this.display_name = null
          this.signature = null
          this.showDialog = false
        } else {
          this.showError = true
        }
      }
    }
  },
  mounted() {
    this.firstName = this.user.first_name
    this.lastName = this.user.last_name
    this.displayName = this.user.display_name
    this.signature = this.user.signature
  }
}
</script>