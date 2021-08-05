<template>
  <v-card flat color="rgb(255,255,255,0.5)">
    <v-card-title class="title">
      {{$t('pages.deals.index.title')}}
      <v-spacer />
      <v-btn @click="setViewMode(0)" icon small color="primary" :disabled="mode === 0">
        <v-icon small>fa-th</v-icon>
      </v-btn>
      <v-btn @click="setViewMode(1)" icon small color="primary" :disabled="mode === 1">
        <v-icon small>fa-list</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider />
    <v-card-actions class="grey lighten-5 py-0">
      <v-layout row wrap px-3>
        <v-flex xs12 sm4 px-1>
          <v-text-field
            @click:append="search"
            @click:clear="clearSearch"
            @keyup.enter="search"
            single-line
            clearable
            append-icon="fa-search"
            :placeholder="$t('pages.deals.index.search')"
            v-model="keyword"
          />
        </v-flex>
        <v-flex xs12 sm4 px-1>
          <v-autocomplete
            @change="filter"
            @click:clear="clearCategory"
            clearable
            :label="$t('pages.deals.index.category')"
            :menu-props="{maxHeight:'400'}"
            v-model="category"
            :items="categoryNames"
          />
        </v-flex>
        <v-flex xs12 sm4 px-1>
          <v-autocomplete
            @change="filter"
            @click:clear="clearTag"
            clearable
            :label="$t('pages.deals.index.tag')"
            :menu-props="{maxHeight:'400'}"
            v-model="tag"
            :items="tags"
          />
        </v-flex>
      </v-layout>
    </v-card-actions>
    <v-divider />
    <!-- grid view -->
    <v-container grid-list-md fluid v-show="mode === 0">
      <v-layout wrap>
        <v-flex v-for="(deal, index) in deals" :key="index" xs12 sm4 lg3>
          <grid-card @clicked="onClickDeal" :deal="deal" />
        </v-flex>
      </v-layout>
    </v-container>
    <!-- table view -->
    <list v-show="mode === 1" @clicked="onClickDeal" :deals="deals" />
    <v-card-actions v-show="totalPages > 0">
      <v-spacer />
      <v-btn
        @click="goToPage(index)"
        v-for="index in totalPages"
        :key="index"
        :disabled="page == index"
        small
        :outlined="page != index"
        color="primary"
        class="mx-1"
      >{{ index }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import GridCard from '@/components/deal/grid-card'
import Table from '@/components/deal/table'
export default {
  components: {
    'grid-card': GridCard,
    list: Table
  },
  watchQuery: ['page', 'keyword', 'tag', 'category'],
  async asyncData({ store, query }) {
    const categories = store.getters['dealscategories/']
    const user = store.getters['user/user']
    const page = query['page']
    const categoryName = query['category']
    const category =
      categories && categoryName
        ? categories.find(item => item.name === categoryName)
        : null
    const tag = query['tag']
    const keyword = query['keyword']
    const response = keyword
      ? await store.dispatch('deals/searchDeals', {
          categories: categories,
          user: user,
          keyword: keyword,
          page: page
        })
      : await store.dispatch('deals/fetchDeals', {
          categories: categories,
          user: user,
          category: category,
          tag: tag,
          page: page
        })
    return { deals: response.deals, totalPages: response.total_pages }
  },
  data() {
    return {
      page: this.$route.query['page'] || 1,
      tag: this.$route.query['tag'] != undefined ? this.$route.query['tag'] : null,
      category: this.$route.query['category'],
      keyword: this.$route.query['keyword']
    }
  },
  computed: {
    ...mapGetters({
      mode: 'viewMode',
      categories: 'deals/categories',
      categoryNames: 'deals/categoriesName',
      tags: 'deals/tags'
    })
  },
  methods: {
    ...mapActions(['setViewMode']),
    search() {
      this.$router.push(
        this.localePath({ name: 'deals', query: { keyword: this.keyword } })
      )
    },
    clearSearch() {
      this.$router.push(this.localePath({ name: 'deals' }))
    },
    filter() {
      const query = {}
      if (this.tag) query.tag = this.tag
      if (this.category) query.category = this.category
      if (this.page) query.page = this.page
      this.$router.push(
        this.localePath({
          name: 'deals',
          query: query
        })
      )
    },
    clearCategory() {
      const query = {}
      if (this.tag) query.tag = this.tag
      this.$router.push(this.localePath({ name: 'deals', query: query }))
    },
    clearTag() {
      const query = {}
      if (this.category) query.category = this.category
      this.$router.push(this.localePath({ name: 'deals', query: query }))
    },
    onClickDeal(id) {
      this.$router.push(
        this.localePath({ name: 'deals-id', params: { id: id } })
      )
    },
    goToPage(page) {
      const query = {}
      if (this.tag) query.tag = this.tag
      if (this.category) query.category = this.category
      if (this.keyword) query.keyword = this.keyword
      if (this.page) query.page = page
      this.$router.push(
        this.localePath({
          name: 'deals',
          query: query
        })
      )
    }
  }
}
</script>
