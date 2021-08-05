<template>
  <v-layout column>
    <!-- sponsored deals -->
    <sponsored-deals @clicked="onClickDeal" :items="carouselItems" />

    <v-card flat color="rgb(255,255,255,0.5)" class="mt-5">
      <v-card-title class="title">
        {{$t("pages.index.top")}}
        <v-spacer />
        <v-btn @click="setViewMode(0)" icon small color="primary" :disabled="mode === 0">
          <v-icon small>fa-th</v-icon>
        </v-btn>
        <v-btn @click="setViewMode(1)" icon small color="primary" :disabled="mode === 1">
          <v-icon small>fa-list</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <!-- grid view -->
      <v-container grid-list-md fluid v-show="mode === 0">
        <v-layout wrap>
          <v-flex v-for="(deal, index) in popularDeals" :key="index" xs12 sm4 lg3>
            <grid-card @clicked="onClickDeal" :deal="deal" />
          </v-flex>
        </v-layout>
      </v-container>
      <!-- table view -->
      <list v-show="mode === 1" @clicked="onClickDeal" :deals="popularDeals" />
    </v-card>
  </v-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SponsoredDeals from '@/components/deal/sponsored-deal'
import GridCard from '@/components/deal/grid-card'
import Table from '@/components/deal/table'
export default {
  head: {
    title: 'MeeDeal.com'
  },
  components: {
    'sponsored-deals': SponsoredDeals,
    'grid-card': GridCard,
    list: Table
  },
  async asyncData({ store }) {
    const categories = store.getters['deals/categories'] || []
    const user = store.getters['user/user'] || null
    const popularDeals = await store.dispatch('deals/fetchPopularDeals', {
      categories: categories,
      user: user
    })
    const sponsoredDeals = await store.dispatch('deals/fetchSponsoredDeals', {
      categories: categories,
      user: user
    })
    return { popularDeals: popularDeals, sponsoredDeals: sponsoredDeals }
  },
  computed: {
    ...mapGetters({
      mode: 'viewMode',
      categories: 'deals/categories',
      user: 'user/user'
    }),
    carouselSize() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 1
        case 'sm':
          return 3
        case 'md':
          return 3
        case 'lg':
          return 4
        case 'xl':
          return 4
      }
    },
    carouselItems() {
      if (this.popularDeals) {
        return this.chunkDeals(this.popularDeals, this.carouselSize)
      }
      return null
    }
  },
  methods: {
    ...mapActions(['setViewMode']),
    chunkDeals(myArray, chunk_size) {
      var index = 0
      var arrayLength = myArray.length
      var tempArray = []
      for (index = 0; index < arrayLength; index += chunk_size) {
        var myChunk = myArray.slice(index, index + chunk_size)
        tempArray.push(myChunk)
      }
      return tempArray
    },
    onClickDeal(id) {
      this.$router.push(this.localePath({ name: 'deals-id', params: { id: id } }))
    }
  }
}
</script>
