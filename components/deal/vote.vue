<template>
  <div>
    <v-btn @click="executeVoteUp" :disabled="!isLoggedIn" small icon text class="mr-0">
      <v-icon small :color="voteUpColor">fa-thumbs-up</v-icon>
    </v-btn>
    <v-chip small color="light-blue lighten-4" class="mx-2">
      <strong>Votes:</strong>
      {{ deal.votes }}
    </v-chip>
    <v-btn @click="executeVoteDown" :disabled="!isLoggedIn" small icon text>
      <v-icon small :color="voteDownColor">fa-thumbs-down</v-icon>
    </v-btn>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      deal: 'deals/deal'
    }),
    voteUpColor() {
      return this.deal.user_vote === 1 ? 'success' : 'grey'
    },
    voteDownColor() {
      return this.deal.user_vote === -1 ? 'error' : 'grey'
    }
  },
  methods: {
    ...mapActions('deals', ['voteDeal']),
    async executeVoteUp() {
      const isSuccess =
        this.deal.user_vote === 1
          ? await this.voteDeal({ id: this.deal.id, vote: 'reset' })
          : await this.voteDeal({ id: this.deal.id, vote: 'up' })
    },
    async executeVoteDown() {
      const isSuccess =
        this.deal.user_vote === -1
          ? await this.voteDeal({ id: this.deal.id, vote: 'reset' })
          : await this.voteDeal({ id: this.deal.id, vote: 'down' })
    }
  }
}
</script>