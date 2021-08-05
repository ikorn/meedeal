<template>
  <nuxt-child />
</template>
<script>
export default {
  validate({ params }) {
    return /^[0-9]+$/.test(params.id)
  },
  head() {
    return {
      title: `MeeDeal.com - ${this.deal.title}`,
      meta: [
        { hid: 'description', name: 'description', content: this.deal.title },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `${this.deal.cateogory_name},${this.deal.tags.join(',')}`
        }
      ]
    }
  }
}
</script>