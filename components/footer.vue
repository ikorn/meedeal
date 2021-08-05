<template>
  <v-card color="rgb(0, 0, 0, 0.75)" dark flat tile width="100%">
    <v-card-actions>
      <v-spacer />
      <v-btn :to="localePath({ name: 'index' })" nuxt exact icon small color="white" class="mx-2">
        <v-icon small>fa-home</v-icon>
      </v-btn>
      <v-btn :to="localePath({ name: 'deals' })" nuxt exact icon small color="white" class="mx-2">
        <v-icon small>fa-tags</v-icon>
      </v-btn>
      <v-btn
        v-show="isLoggedIn"
        :to="localePath({ name: 'users' })"
        nuxt
        exact
        icon
        small
        color="white"
        class="mx-2"
      >
        <v-icon small>fa-user</v-icon>
      </v-btn>
      <v-spacer />
    </v-card-actions>
    <v-divider />
    <v-card-actions class="caption white--text px-3 py-1">
      (C) {{ new Date().getFullYear() }} —&nbsp;<strong>MeeDeal</strong>
      <v-spacer />
      <v-btn
        @click="changeLanguage('th')"
        outlined
        small
        :disabled="locale == 'th'"
        class="mx-2"
      >ภาษาไทย</v-btn>
      <v-divider vertical />
      <v-btn
        @click="changeLanguage('en')"
        outlined
        small
        :disabled="locale == 'en'"
        class="mx-2 text-none"
      >English</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({ isLoggedIn: 'user/isLoggedIn' }),
    locale() {
      return this.$i18n.locale
    }
  },
  methods: {
    changeLanguage(lang) {
      // Change the i18n context object's locale
      // This makes it so the correct locale file is used
      this.$i18n.locale = lang
    }
  }
}
</script>