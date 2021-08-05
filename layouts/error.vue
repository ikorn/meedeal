<template>
  <v-card flat color="rgb(255,255,255,0.5)">
    <v-card-title class="title">{{ isNotFound ? 'Page not found' : 'An error occured' }}</v-card-title>
    <v-divider />
    <v-card-text class="text-center">
      <v-icon large>fa-bomb</v-icon>
      <br />
      <span v-show="isNotFound">What are you looking for?</span>
      <span v-show="!isNotFound">Error code: {{ error.statusCode }}</span>
    </v-card-text>
    <v-card-actions>
      <v-btn :to="localePath({ name:'index' })" text small color="green" class="text-none mt-2">
        <v-icon small left>fa-chevron-left</v-icon>Back to Home
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  layout: 'preauth',
  props: ['error'],
  computed: {
    isNotFound() {
      return this.error.statusCode === 404
    }
  }
}
</script>