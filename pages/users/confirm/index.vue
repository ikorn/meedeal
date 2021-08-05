<template>
  <v-card>
    <v-card-title class="display-1">Verify Account.</v-card-title>
    <v-divider />
    <v-card-text v-show="showError == null">
      <v-spacer />
      <v-progress-circular indeterminate color="primary" class="mb-5" :size="70" :width="7" />
      <v-spacer />
    </v-card-text>
    <v-card-text v-show="showError == true" class="text-xs-center">
      Error occurs while verifying account.
      <br />Please check your URL and try again.
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  validate({ query }) {
    return query['code'] != null
  },
  async asyncData({ query, store }) {
    const isSuccess = await store.dispatch('user/verifyAccount', query['code'])
    if (isSuccess) this.$router.push(this.localePath({ name: 'users/signin' }))
    else this.showError = true
  },
  data() {
    return {
      showError: null
    }
  }
}
</script>