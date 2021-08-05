<template>
  <v-app>
    <v-app-bar color="rgb(0, 0, 0, 0.75)" app dark fixed>
      <v-toolbar-title>
        <img src="/images/logo.png" height="50" class="pt-1" />
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn :to="localePath({ name: 'index' })" nuxt exact text small color="white">
          <v-icon small :left="$vuetify.breakpoint.mdAndUp">fa-home</v-icon>
          <span class="hidden-sm-and-down">{{$t("pages.index.title")}}</span>
        </v-btn>
        <v-btn :to="localePath({ name: 'deals' })" nuxt exact text small color="white">
          <v-icon small :left="$vuetify.breakpoint.mdAndUp">fa-tags</v-icon>
          <span class="hidden-sm-and-down">{{$t("pages.deals.index.title")}}</span>
        </v-btn>
        <v-btn
          v-show="isAuthenticated"
          :to="localePath({ name: 'deals-new' })"
          nuxt
          exact
          text
          small
          color="white"
        >
          <v-icon small :left="$vuetify.breakpoint.mdAndUp">fa-plus</v-icon>
          <span class="hidden-sm-and-down">{{$t("pages.deals.new.title")}}</span>
        </v-btn>
        <v-divider vertical />
        <v-btn
          v-show="isAuthenticated"
          :to="localePath({ name: 'users' })"
          nuxt
          exact
          text
          small
          color="white"
        >
          <v-icon small :left="$vuetify.breakpoint.mdAndUp">fa-user</v-icon>
          <span class="hidden-sm-and-down">{{$t("pages.user.index.title")}}</span>
        </v-btn>
        <v-btn
          v-show="!isAuthenticated"
          :to="localePath({ name: 'users-signin' })"
          nuxt
          exact
          text
          small
          color="green"
        >
          <v-icon small :left="$vuetify.breakpoint.mdAndUp">fa-sign-in</v-icon>
          <span
            class="hidden-sm-and-down"
          >{{$t("pages.sign_in.title")}}/{{$t("pages.sign_up.title")}}</span>
        </v-btn>

        <signout />
      </v-toolbar-items>
    </v-app-bar>
    <v-content
      style="background-image: url('/images/background.jpg'); background-repeat: no-repeat;
  background-attachment: fixed;"
    >
      <v-container>
        <transition name="fade">
          <nuxt />
        </transition>
      </v-container>
    </v-content>

    <v-footer class="pa-0">
      <copyright />
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SignOut from '@/components/user/signout'
import Footer from '@/components/footer'
export default {
  components: {
    signout: SignOut,
    copyright: Footer
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  }
}
</script>
