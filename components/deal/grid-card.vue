<template>
  <v-hover v-if="deal">
    <template v-slot:default="{ hover }">
      <v-card @click="onClick" class="mx-auto">
        <v-img
          :src="deal.image"
          height="150px"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        >
          <v-card-title class="white--text fill-height align-end">
            <h4>{{ deal.title | truncate(50) }}</h4>
          </v-card-title>
        </v-img>
        <v-card-actions class="pb-0 grey--text subtitle-2">
          <v-icon small left color="grey">fa-user</v-icon>
          {{ deal.posted_by.display_name }}
          <v-spacer />
          <v-icon small left color="grey">fa-clock</v-icon>
          {{ deal.posted_on | dateFormat('MM/DD/YYYY') }}
        </v-card-actions>
        <v-card-actions class="pt-0">
          <v-icon small left color="green">fa-thumbs-up</v-icon>
          <span class="green--text subtitle-2">{{ deal.votes }}</span>
          <v-spacer />
          <v-chip small v-show="deal.is_expired" color="red" class="white--text">expired</v-chip>
        </v-card-actions>
        <v-fade-transition>
          <v-overlay v-if="hover" light absolute>
            <v-btn rounded>See more info</v-btn>
          </v-overlay>
        </v-fade-transition>
      </v-card>
    </template>
  </v-hover>
</template>
<script>
export default {
  props: ['deal'],
  methods: {
    onClick() {
      this.$emit('clicked', this.deal.id)
    }
  }
}
</script>
