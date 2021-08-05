import Vue from 'vue'
import messageEn from 'vee-validate/dist/locale/en'
import messageTh from 'vee-validate/dist/locale/th'

import * as VeeValidate from 'vee-validate'

Vue.use(VeeValidate)
Validator.localize('en', messageEn)
Validator.localize('th', messageTh)