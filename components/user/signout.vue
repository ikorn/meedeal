<template>
  <v-dialog v-model="showDialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" v-show="isAuthenticated" nuxt exact text small color="red">
        <v-icon small :left="$vuetify.breakpoint.mdAndUp">fa-sign-out</v-icon>
        <span class="hidden-sm-and-down">{{$t('pages.sign_out.submit')}}</span>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{$t('pages.sign_out.title')}}</span>
      </v-card-title>
      <v-card-text>{{$t('pages.sign_out.subtitle')}}</v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="red white--text" small @click="executeSignOut">{{$t('pages.sign_out.submit')}}</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="showError" right color="error" timout="500">{{$t('pages.sign_out.error')}}</v-snackbar>
  </v-dialog>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters(['isAuthenticated', 'strategy'])
  },
  data() {
    return {
      showDialog: false,
      showError: false
    }
  },
  methods: {
    ...mapActions('user', ['signOut']),
    async executeSignOut() {
      const isSuccess = await this.signOut(this.$auth.getToken(this.strategy))
      this.showDialog = false
      if (isSuccess) {
        this.$auth.logout()
        this.$router.push({ name: 'index' })
      } else this.showError = true
    }
  }
}
</script>