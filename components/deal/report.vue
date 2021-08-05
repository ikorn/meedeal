<template>
  <v-dialog v-model="showDialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" v-show="isLoggedIn" small icon>
        <v-icon small color="red">fa-exclamation-circle</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Report Deal</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          name="title"
          type="text"
          label="Title"
          v-model="title"
          readonly
          disabled
        />
        <v-textarea v-model="detail" label="detail" required />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue white--text" small @click="executeReport">Report</v-btn>
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
  props: ['title'],
  data() {
    return {
      detail: null,
      showDialog: false,
      showError: false
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn'
    })
  },
  methods: {
    ...mapActions('deals', ['reportDeal']),
    async executeReport() {
      if (!this.detail) return
      const isSuccess = await this.reportDeal({
        id: this.deal.id,
        data: this.detail
      })
      if (isSuccess) {
        this.detail = null
        this.showDialog = false
      } else {
        this.showError = true
      }
    }
  }
}
</script>