<template>
  <v-card color="rgb(255,255,255,0.5)">
    <v-card-title class="title">Confirm</v-card-title>
    <v-divider />
    <v-card-text>
      <v-text-field v-model="formData.title" label="Title" prepend-icon="fa-tag" disabled />
      <v-text-field v-model="formData.url" label="Link" prepend-icon="fa-link" disabled />
      <span v-show="formData.detail" class="v-label theme--light">
        <v-icon class="mr-3">fa-file-alt</v-icon>Detail
      </span>
      <div v-show="formData.detail" class="ml-8">
        <span v-html="formData.detail" class="html-content" />
      </div>

      <v-text-field
        v-model="formData.expirationDate"
        label="Expired date"
        prepend-icon="fa-calendar-alt"
        disabled
      />
      <v-text-field v-model="formData.category" label="Category" prepend-icon="fa-filter" disabled />
      <v-chip-group
        v-show="inputedTags.length > 0"
        multiple
        column
        class="ml-8"
        active-class="primary--text"
      >
        <v-chip
          v-for="tag in inputedTags"
          :key="tag.key"
          small
          label
          color="pink"
          text-color="white"
          class="caption light-blue lighten-4"
        >
          <v-icon small left>fa-tag</v-icon>
          {{ tag }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
    <v-divider v-show="formData.images.data.length > 0" />
    <v-container v-show="formData.images.data.length > 0" grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <v-file-input v-model="formData.images.files" small-chips disabled />
        </v-flex>
        <v-flex v-for="(image, index) in formData.images.data" :key="index" xs4 sm3 md2>
          <v-card>
            <v-img :src="image" height="150px" />
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-divider />
    <v-card-actions>
      <v-btn :to="localePath({ name: 'deals-new' })" text color="orange">Back</v-btn>
      <v-spacer />
      <v-btn @click="executePostDeal" color="blue white--text text-none" depressed>Post Deal</v-btn>
    </v-card-actions>
    <v-snackbar
      v-model="showError"
      right
      color="error"
      timout="500"
    >Error occured. Please try again.</v-snackbar>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  middleware: 'auth',
  data() {
    return {
      showError: false
    }
  },
  computed: {
    ...mapGetters({
      categories: 'deals/categories',
      formData: 'deals/formData'
    }),
    inputedTags() {
      return this.formData.tags && this.formData.tags.length > 0
        ? this.formData.tags
            .split(',')
            .filter(tag => tag.length > 0)
            .unique()
        : []
    }
  },
  methods: {
    ...mapActions('deals', ['postDeal']),
    async executePostDeal() {
      const category = this.categories.find(category => category.name == name)
      const deal = {
        title: this.formData.title.trim(),
        detail: this.formData.detail.trim(),
        link: this.formData.url.trim(),
        category: category ? category.id : null,
        tags: this.inputedTags,
        expired_on: this.formData.expirationDate
          ? this.formData.expirationDate + 'T00:00:00Z'
          : null
      }
      const response = await this.postDeal({
        deal: deal,
        images: this.formData.images
      })
      if (response)
        this.$router.push(
          this.localePath({ name: 'deals-id', params: { id: response.id } })
        )
      else this.showError = true
    }
  }
}
</script>
