<template>
  <div v-if="deal">
    <v-card flat color="rgb(255,255,255,0.5)">
      <v-card-title class="title">
        {{ deal.title }}
        <v-btn
          v-show="deal.link"
          :href="deal.link"
          small
          icon
          color="primary"
          target="_blank"
          class="mx-3"
        >
          <v-icon small>fa-link</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />

      <v-card-text class="font-weight-bold black--text pa-0">
        <v-container>
          <v-row>
            <v-col>
              Created at {{ deal.posted_on | dateFormat('DD/MM/YYYY hh:mm') }} by&nbsp;
              <v-menu v-model="owner" :close-on-content-click="false" :nudge-width="200" offset-x>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    small
                    color="success"
                    class="text-none"
                  >{{ deal.posted_by.display_name }}</v-btn>
                </template>
                <owner :owner="deal.posted_by" />
              </v-menu>
            </v-col>
            <share :path="$route.fullPath" />
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider />

      <v-card-actions>
        <vote />
        <v-divider vertical class="mx-3" />
        <div class="caption">
          <v-icon small left>fa-eye</v-icon>
          {{ deal.views_count }} Views
          <br />
          <v-icon small left>fa-comments</v-icon>
          {{ deal.comments_count }} Comments
        </div>
        <v-spacer />
        <v-btn
          :to="localePath({ name: 'deals-id-edit', params: { id: deal.id } })"
          v-show="user != null && deal.posted_by.id === user.id"
          small
          icon
          color="orange"
        >
          <v-icon small>fa-edit</v-icon>
        </v-btn>
        <report :title="deal.title" />
      </v-card-actions>
      <v-divider />
      <v-card-text class="pa-0">
        <v-tabs v-model="tab" grow>
          <v-tab>Deal Content</v-tab>
          <v-tab>Image Attachments</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="pa-3 grey lighten-5">
          <v-tab-item>
            <detail :deal="deal" />
          </v-tab-item>
          <v-tab-item>
            <attachment :attachment="deal.attachments" />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-divider />
    </v-card>
    <comments />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Share from '@/components/deal/share'
import Owner from '@/components/deal/deal-owner'
import Vote from '@/components/deal/vote'
import Report from '@/components/deal/report'
import Detail from '@/components/deal/detail'
import Attachment from '@/components/deal/attachment'
import Comments from '@/components/deal/comments'
export default {
  components: {
    share: Share,
    owner: Owner,
    vote: Vote,
    report: Report,
    detail: Detail,
    attachment: Attachment,
    comments: Comments
  },
  async asyncData({ params, route, store }) {
    const categories = store.getters['deals/categories'] || []
    const user = store.getters['user/user'] || null
    try {
      const isSuccess = await store.dispatch('deals/fetchDealById', {
        categories: categories,
        user: user,
        id: params.id
      })
      if (!isSuccess) route.push(this.localePath({ name: 'deals ' }))
    } catch {
      route.push(this.localePath({ name: 'deals ' }))
    }
  },
  data() {
    return {
      tab: null,
      owner: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      isLoggedIn: 'user/isLoggedIn',
      deal: 'deals/deal'
    })
  }
}
</script>
