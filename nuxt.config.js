require('dotenv').config({
  path: `.env${process.env.NODE_ENV === 'production' ? '' : '.dev'}`
})
import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',
  env: {
    domain: process.env.DOMAIN,
    apiBaseUrl: process.env.API_BASE_URL,
    clientId: process.env.CLIENT_ID,
    facebookId: process.env.FACEBOOK_ID
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: 'MeeDeal.com',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Meedeal.com เว็บแรกที่คุณเลือก รวมดีลมากมาย ที่นี่มีดีลดอทคอม'
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: 'meedeal.com, meedeal, deal, มีดีล, ดีล'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.0.13/css/all.css'
      }
    ],
    script: [
      { src: 'https://apis.google.com/js/api:client.js' },
      { src: '/js/facebook.js' }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/filters',
    '@/plugins/axios',
    '@/plugins/repository',
    '@/plugins/vee-validate',
    { src: '@/plugins/auth.js', ssr: false },
    { src: '@/plugins/nuxt-quill-plugin', ssr: false },
    { src: '@/plugins/social.js', ssr: false }
  ],
  loading: '@/components/loading.vue',
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/vuetify'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
    '@nuxtjs/moment',
    '@nuxtjs/font-awesome',
    'nuxt-i18n',
    'cookie-universal-nuxt'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: `${process.env.apiBaseUrl}`,
    browserBaseURL: '/api/',
    proxy: true,
    proxyHeaders: false,
    credentials: false
  },
  proxy: {
    '/api/': {
      target: `${process.env.apiBaseUrl}`,
      pathRewrite: { '^/api/': '' }
    }
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'o/token/',
            method: 'post',
            propertyName: 'access_token'
          },
          callback: 'user/callback',
          logout: false,
          user: {
            url: 'users/current/',
            method: 'get',
            propertyName: false
          },
          tokenRequired: true,
          tokenName: 'Authorization',
          tokenType: 'Bearer'
        }
      },
      facebook: {
        client_id: process.env.FACEBOOK_ID,
        userinfo_endpoint:
          'https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email',
        scope: ['public_profile', 'email'],
        redirect_uri: 'http://localhost:3000/users/callback'
      },
      google: {
        client_id:
          '760383399648-4ea9vg08ovpf0rol3up9i2qtjhp4u5u6.apps.googleusercontent.com',
        redirect_uri: 'http://localhost:3000/users/callback'
      }
    },
    redirect: {
      login: '/user/signin',
      logout: '/',
      callback: '/login',
      home: '/'
    }
  },
  i18n: {
    strategy: 'no_prefix',
    locales: [
      { code: 'th', name: 'Thai', file: 'th.js' },
      { code: 'en', name: 'English', file: 'en.js' }
    ],
    defaultLocale: 'th',
    vueI18n: {
      fallbackLocale: 'th'
    },
    lazy: true,
    langDir: 'locale/'
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      icons: {
        iconfont: 'fa'
      },
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    vendor: ['vue-social-sharing', 'vee-validate'],
    plugins: [],
    /*
     ** You can extend webpack config here
     */
    extend(config, context) {}
  }
}
