<template>
  <v-card>
    <v-card-title class="display-1">{{$t('pages.sign_up.title')}}</v-card-title>
    <v-divider />
    <v-card-text>
      <v-container>
        <v-row class="d-flex d-sm-none">
          <v-col>
            <signupContent />
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" md="5" class="d-none d-sm-flex">
            <signupContent />
          </v-col>
          <v-col xs="12" md="7">
            <h3 class="black--text">{{$t('pages.sign_up.sign_in_info')}}</h3>
            <v-alert type="error" :value="!emailAvailable" class="mb-3">Email not available</v-alert>
            <ValidationProvider
              name="email"
              rules="required|email|min:6"
              v-slot="{ errors, valid }"
            >
              <v-text-field
                @blur="executeCheckEmail"
                v-model="email"
                :error-messages="errors"
                :success="valid"
                :label="$t('user.email')"
                required
              />
            </ValidationProvider>
            <ValidationProvider name="password" rules="required|min:6" v-slot="{ errors, valid }">
              <v-text-field
                type="password"
                v-model="password"
                :error-messages="errors"
                :label="$t('user.password')"
                :success="valid"
                ref="password"
                required
              />
            </ValidationProvider>
            <ValidationProvider
              name="confirmPassword"
              rules="required|min:6|confirmed:password"
              v-slot="{ errors, valid }"
            >
              <v-text-field
                type="password"
                v-model="confirmPassword"
                :error-messages="errors"
                :success="valid"
                :label="$t('user.password_confirm')"
                required
              />
            </ValidationProvider>
            <h3 class="black--text">Account Info.</h3>
            <v-alert type="error" :value="!displayAvailable">Display name not available</v-alert>
            <ValidationProvider
              name="displayName"
              rules="required|min:6"
              v-slot="{ errors, valid }"
            >
              <v-text-field
                @blur="executeCheckDisplayName"
                v-model="displayName"
                :error-messages="errors"
                :success="valid"
                :label="$t('user.display')"
                required
              />
            </ValidationProvider>
            <v-text-field v-model="registrationCode" :label="$t('pages.sign_up.code')" />
            <ValidationProvider rules="required" name="terms" v-slot="{ errors, valid }">
              <v-checkbox
                v-model="terms"
                :error-messages="errors"
                :success="valid"
                color="green"
                required
              >
                <template v-slot:label>
                  {{$t('pages.sign_up.agree')}}&nbsp;
                  <terms />
                </template>
              </v-checkbox>
            </ValidationProvider>
            <v-btn
              @click="executeSignUp"
              color="blue white--text text-none"
              block
            >{{$t('pages.sign_up.submit')}}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn
        :to="localePath({ name: 'users-signin' })"
        text
        small
        color="green"
        class="text-none mt-2"
      >
        <v-icon small left>fa-chevron-left</v-icon>
        {{$t('pages.sign_up.back')}}
      </v-btn>
    </v-card-actions>
    <v-snackbar
      v-model="showError"
      right
      color="error"
      timout="500"
    >Error occured while sign in. Please try again.</v-snackbar>
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import SignUpContent from '@/components/user/signup'
import Terms from '@/components/user/terms'
export default {
  layout: 'preauth',
  components: {
    ValidationProvider,
    ValidationObserver,
    signupContent: SignUpContent,
    terms: Terms
  },
  data() {
    return {
      email: null,
      password: null,
      confirmPassword: null,
      displayName: null,
      registrationCode: null,
      terms: false,
      emailAvailable: true,
      displayAvailable: true,
      showError: false
    }
  },
  methods: {
    ...mapActions('user', ['checkEmail', 'checkDisplayName', 'signUp']),
    showTerms() {},
    async executeCheckEmail() {
      const isValid = await this.$validator.validate('email', this.email)
      if (isValid) this.emailAvailable = await this.checkEmail(this.email)
    },
    async executeCheckDisplayName() {
      const isValid = await this.$validator.validate(
        'displayName',
        this.displayName
      )
      if (isValid)
        this.displayAvailable = await this.checkDisplayName(this.displayName)
    },
    async executeSignUp() {
      const isValid = await this.$validator.validateAll()
      if (isValid && this.emailAvailable && this.displayAvailable) {
        const isSuccess = await this.signUp({
          email: this.email,
          password: this.password,
          display_name: this.displayName,
          code: this.registrationCode
        })
        if (isSuccess)
          this.$router.push(this.localePath({ name: 'users-signin' }))
        else this.showError = true
      }
    }
  }
}
</script>