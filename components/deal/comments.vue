<template>
  <v-card flat class="mt-3" color="rgb(255,255,255,0.5)">
    <v-card-title class="subtitle-2">
      <v-icon small left>fa-comments</v-icon>
      {{ deal.comments_count }} Comments
    </v-card-title>
    <v-divider v-show="isLoggedIn" />
    <v-form v-show="isLoggedIn" class="pa-3">
      <v-textarea v-model="detail" label="Comment" filled required />
      <v-btn @click="executePost" small color="primary">Post</v-btn>
    </v-form>
    <v-divider v-if="deal.comments && deal.comments.length" />
    <v-container v-if="deal.comments" column>
      <v-row v-for="(comment, key) in deal.comments" :key="key">
        <comment :deal="deal" :comment="comment" />
      </v-row>
    </v-container>
    <v-card-actions v-show="deal.comments_next">
      <v-spacer />
      <v-btn
        @click="executeLoadComments"
        small
        rounded
        color="blue white--text"
        class="px-3"
      >Load more</v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Comment from '@/components/deal/comment'
export default {
  components: {
    comment: Comment
  },
  data() {
    return {
      detail: null,
      commentPage: 1
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      isLoggedIn: 'user/isLoggedIn',
      deal: 'deals/deal'
    })
  },
  methods: {
    ...mapActions('deals', ['fetchCommentsByDealId', 'postComment']),
    async executeLoadComments() {
      const isSuccess = await this.fetchCommentsByDealId({
        user: this.user,
        dealId: this.deal.id,
        page: this.commentPage + 1
      })
      if (isSuccess) this.commentPage += 1
    },
    async executePost() {
      if (this.detail) {
        const isSuccess = await this.postComment({
          dealId: this.deal.id,
          user: this.user,
          detail: this.detail
        })
        if (isSuccess) this.detail = null
      }
    }
  }
}
</script>