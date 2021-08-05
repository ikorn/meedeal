<template>
  <v-container fluid>
    <v-row v-show="!attachments || attachments.length == 0">
      <v-col>No attachment</v-col>
    </v-row>
    <v-row v-show="attachments && attachments.length">
      <v-col
        v-for="(attachment, index) in attachments"
        :key="index"
        class="d-flex child-flex"
        xs="6"
        sm="4"
        md="3"
      >
        <v-card flat tile class="d-flex">
          <v-img
            :src="attachment.thumbnail_url"
            :lazy-src="attachment.url"
            aspect-ratio="1"
            class="grey lighten-2"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: ['attachments']
}
</script>