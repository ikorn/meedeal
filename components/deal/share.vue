<template>
  <v-col cols="auto" text-right>
    <social-sharing :url="sharedURL" inline-template>
      <div>
        <network network="facebook">
          <v-icon small color="rgb(60,90,153,1)">fa-facebook</v-icon>
        </network>
        <v-divider vertical class="mx-3" />
        <network network="twitter">
          <v-icon small color="rgb(219,68,55,1)">fa-twitter</v-icon>
        </network>
      </div>
    </social-sharing>
  </v-col>
</template>
<script>
export default {
  props: ['path'],
  computed: {
    sharedURL() {
      return `${process.env.domain}${this.path}`
    }
  }
}
</script>