<template>
  <div>
    <span v-html="deal.detail" class="html-content" />
    <br />
    <div v-if="deal.tags.length > 0">
      <div v-show="deal.category_name">
        <span class="caption font-weight-bold">Category</span>
        <br />
        {{ deal.category_name }}
      </div>
      <br />
      <span class="caption font-weight-bold">Tags</span>
      <v-chip-group multiple column active-class="primary--text">
        <v-chip
          v-for="item in deal.tags"
          :key="item.key"
          :to="localePath({ name: 'deals', query: { tag: item }})"
          small
          label
          class="caption light-green lighten-4"
        >{{ item }}</v-chip>
      </v-chip-group>
    </div>
  </div>
</template>
<script>
export default {
  props: ['deal']
}
</script>