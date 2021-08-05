<template>
  <v-col>
    <v-card flat class="grey lighten-4">
      <v-card-title class="pa-1">
        <v-avatar size="32px" class="mt-1 ml-1 mr-3" style="float: right">
          <img :src="comment.posted_by.avatar_url" alt="avatar" />
        </v-avatar>
        <span class="subtitle-1">{{ comment.posted_by.display_name }}</span>
        <v-spacer />
        <span class="caption">
          <v-icon small left>fa-calendar</v-icon>
          {{ comment.posted_on | dateFormat('DD/MM/YYYY hh:mm') }}
        </span>
      </v-card-title>
      <v-card-text class="px-2 py-0">
        <v-card flat class="my-1">
          <v-card-text class="pa-2">
            <span v-html="formatString(comment.content)" />
          </v-card-text>
          <v-divider />
          <v-card-actions class="pa-1">
            <v-btn
              @click="executeVoteUp"
              :disabled="!isLoggedIn"
              small
              icon
              text
              :color="voteUpColor"
              class="ma-0"
            >
              <v-icon small>fa-thumbs-up</v-icon>
            </v-btn>
            <v-chip small color="light-blue lighten-4" class="mx-2">
              <strong>Votes:</strong>
              {{ comment.vote_score }}
            </v-chip>
            <v-btn
              @click="executeVoteDown"
              :disabled="!isLoggedIn"
              small
              icon
              text
              :color="voteDownColor"
              class="my-0"
            >
              <v-icon small>fa-thumbs-down</v-icon>
            </v-btn>
            <v-spacer />

            <v-dialog v-model="showEdit" persistent>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" v-show="comment.is_owner" small icon text color="orange">
                  <v-icon small>fa-edit</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Edit Comment</span>
                </v-card-title>
                <v-card-text>
                  <v-textarea v-model="detail" auto-grow filled label="comment" rows="1" required />
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="showEdit = false">Close</v-btn>
                  <v-btn color="blue darken-1" text @click="executeUpdate">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn @click="executeDelete" v-show="comment.is_owner" small icon text color="red">
              <v-icon small>fa-trash</v-icon>
            </v-btn>
            <v-btn v-show="false" small icon text color="red">
              <v-icon small v-show="isLoggedIn">fa-exclamation-circle</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card-text>
      <v-card-text class="px-2 pt-0 pb-1">
        <span v-html="formatString(comment.posted_by.signature)" />
      </v-card-text>
      <v-divider />
    </v-card>
  </v-col>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['deal', 'comment'],
  data() {
    return {
      showEdit: false,
      detail: this.comment.content
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      user: 'user/user'
    }),
    voteUpColor() {
      return this.comment.user_vote === 1 ? 'success' : 'grey'
    },
    voteDownColor() {
      return this.comment.user_vote === -1 ? 'error' : 'grey'
    }
  },
  methods: {
    ...mapActions('deals', ['updateComment', 'deleteComment', 'voteComment']),
    async executeVoteUp() {
      this.comment.user_vote === 1
        ? await this.voteComment({
            deal: this.deal,
            commentId: this.comment.id,
            vote: 'reset'
          })
        : await this.voteComment({
            deal: this.deal,
            commentId: this.comment.id,
            vote: 'up'
          })
    },
    async executeVoteDown() {
      this.comment.user_vote === -1
        ? await this.voteComment({
            deal: this.deal,
            commentId: this.comment.id,
            vote: 'reset'
          })
        : await this.voteComment({
            deal: this.deal,
            commentId: this.comment.id,
            vote: 'down'
          })
    },
    async executeUpdate() {
      const isSuccess = await this.updateComment({
        deal: this.deal,
        user: this.user,
        commentId: this.comment.id,
        content: this.detail
      })
      if (isSuccess) this.showEdit = false
    },
    async executeDelete() {
      const isSuccess = await this.deleteComment({
        deal: this.deal,
        commentId: this.comment.id
      })
    },
    formatString(string) {
      return string.replace(/(?:\r\n|\r|\n)/g, '<br />')
    }
  }
}
</script>
