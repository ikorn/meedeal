<template>
  <v-dialog v-model="showDialog" scrollable max-width="600px">
    <template v-slot:activator="{ on }">
      <a v-on="on">{{$t('pages.sign_up.terms')}}</a>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{$t('pages.sign_up.terms')}}</span>
      </v-card-title>
      <v-card-text>test<br/>test<br/>test<br/>test<br/>test<br/>test<br/>test<br/>test<br/></v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue white--text" small @click="showDialog = false">{{$t('button.close')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      showDialog: false
    }
  }
}
</script>