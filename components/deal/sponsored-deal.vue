<template>
  <v-card flat color="rgb(255,255,255,0.5)" v-if="items && items.length">
    <v-card-title>
      <span class="title">{{$t("pages.index.sponsor")}}</span>
      <v-btn icon small>
        <v-icon small>fa-info-circle</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider />
    <v-window continuous v-model="index" height="200">
      <v-window-item v-for="(deals, row) in items" :key="row">
        <v-container grid-list-md fluid>
          <v-layout row nowrap align-center fill-height justify-center>
            <v-flex xs12 sm4 lg3 v-for="(deal, column) in deals" :key="column">
              <grid-card @clicked="onClick" :deal="deal" />
            </v-flex>
          </v-layout>
        </v-container>
      </v-window-item>
    </v-window>
    <v-card-actions>
      <v-btn @click="prev" icon small color="orange">
        <v-icon small>fa-chevron-left</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn @click="next" icon small color="orange">
        <v-icon small>fa-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapActions } from 'vuex'
import GridCard from '@/components/deal/grid-card'
export default {
  props: ['items'],
  components: {
    'grid-card': GridCard
  },
  data() {
    return {
      index: 0
    }
  },
  computed: {
    itemSize() {
      return this.items.length
    }
  },
  methods: {
    ...mapActions('deals', ['fetchSponsoredDealById']),
    onClick(id) {
      this.$emit('clicked', id)
    },
    next() {
      this.index = this.index + 1 === this.itemSize ? 0 : this.index + 1
    },
    prev() {
      this.index = this.index - 1 < 0 ? this.itemSize - 1 : this.index - 1
    }
  }
}
</script>
