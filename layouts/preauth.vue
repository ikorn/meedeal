<template>
  <v-app>
    <v-app-bar color="rgb(0, 0, 0, 0.75)" app dark fixed>
      <v-toolbar-title>
        <img src="/images/logo.png" height="50" class="pt-1" />
      </v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    <v-content style="background-image: url('/images/background.jpg')">
      <v-container bg fill-height grid-list-md text-xs-center>
        <v-layout row wrap align-center justify-center>
          <v-spacer />
          <v-flex xs12 md10>
            <transition name="fade">
              <nuxt />
            </transition>
          </v-flex>
          <v-spacer />
        </v-layout>
      </v-container>
    </v-content>
    <v-footer class="pa-0">
      <copyright />
    </v-footer>
  </v-app>
</template>

<script>
import Footer from '@/components/footer'
export default {
  components: {
    copyright: Footer
  },
  data() {
    return {}
  }
}
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
