<template>
  <client-only>
    <v-form v-if="deal" ref="form" v-model="valid" lazy-validation>
      <v-card color="rgb(255,255,255,0.5)">
        <v-card-title class="title">Edit Deal</v-card-title>
        <v-divider />
        <v-card-text>
          <ValidationProvider name="title" rules="required" v-slot="{ errors, valid }">
            <v-text-field
              v-model="title"
              :error-messages="errors"
              :success="valid"
              label="Title"
              required
            />
          </ValidationProvider>
          <ValidationProvider name="link" rules="url" v-slot="{ errors, valid }">
            <v-text-field v-model="url" label="Link" :error-messages="errors" :success="valid" />
          </ValidationProvider>
          <span class="v-label theme--light">
            <v-icon class="mr-3">fa-file-alt</v-icon>Detail
          </span>
          <div class="ml-8">
            <div
              @change="onEditorChange($event)"
              v-quill:myQuillEditor="editorOption"
              :content="detail"
              class="quill-editor"
            />
          </div>

          <v-menu
            v-model="shouldShowDatePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            min-width="290px"
            class="mt-3"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <ValidationProvider name="expirationDate" rules="required" v-slot="{ errors, valid }">
                <v-text-field
                  v-model="expirationDate"
                  v-on="on"
                  :error-messages="errors"
                  :success="valid"
                  label="Expired date"
                  readonly
                />
              </ValidationProvider>
            </template>
            <v-date-picker
              @input="shouldShowDatePicker = false"
              v-model="expirationDate"
              :min="today"
            />
          </v-menu>
          <v-select
            v-model="category"
            :items="categoryNames"
            name="category"
            label="Category"
            prepend-icon="fa-filter"
            required
          />
          <v-text-field
            v-model="tags"
            label="Tags"
            hint="Use comma(,) to separate each tag."
            prepend-icon="fa-tags"
          />
          <v-chip-group
            v-show="inputedTags.length > 0"
            multiple
            column
            class="ml-8 mb-3"
            active-class="primary--text"
          >
            <v-chip
              v-for="tag in inputedTags"
              :key="tag.key"
              small
              label
              color="pink"
              text-color="white"
              class="caption light-blue lighten-4"
            >
              <v-icon small left>fa-tag</v-icon>
              {{ tag }}
            </v-chip>
          </v-chip-group>

          <v-layout column v-if="deal.attachments && deal.attachments.length > 0">
            <span class="v-label theme--light">
              <v-icon class="mr-3">fa-file</v-icon>Attachments
            </span>
            <v-card flat tile color="rgb(255, 255, 255, 0.75)">
              <v-card-text>
                <v-layout row nowrap v-for="(image, key) in deal.attachments" :key="key" px-2>
                  <v-flex text-left>
                    <v-avatar tile class="mr-3">
                      <v-img :src="image.thumbnail_url" />
                    </v-avatar>
                    attachment_{{ key}}
                  </v-flex>
                  <v-flex text-right>
                    <v-btn small icon color="warning" :disabled="deal.attachments.length <= 0">
                      <v-icon small>fa-close</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-layout>
          <v-file-input
            @change="onChangeFile"
            v-model="files"
            accept="image/*"
            label="Select image attachments"
            hint="File size should be less than 1MB"
            multiple
            small-chips
          />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            :to="localePath({ name: 'deals-id', params: { id: deal.id } })"
            text
            color="orange"
            class="text-none"
          >Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="confirm" class="blue white--text text-none">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </client-only>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
export default {
  middleware: 'auth',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  validate({ params }) {
    return /^[0-9]+$/.test(params.id)
  },
  async asyncData({ params, store }) {
    const categories = store.getters['deals/categories'] || []
    const user = store.getters['user/user'] || null
    const isSuccess = await store.dispatch('deals/fetchDealById', {
      categories: categories,
      user: user,
      id: params.id
    })
  },
  data() {
    return {
      editorOption: {
        // some quill options
        modules: {
          toolbar: {
            container: [
              [{ font: [] }],
              [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
              ['bold', 'italic', 'underline', 'strike'], // toggled buttons

              [{ align: [] }],
              [{ color: [] }, { background: [] }], // dropdown with defaults from theme

              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

              ['blockquote', 'code-block'],

              ['clean'], // remove formatting button

              ['link', 'image']
            ],
            handlers: {
              image: function(value) {
                if (value) {
                  var url = prompt('Enter the URL')
                  this.quill.format('image', url)
                } else {
                  this.quill.format('image', false)
                }
              },
              link: function(value) {
                if (value) {
                  var href = prompt('Enter the URL')
                  this.quill.format('link', href)
                } else {
                  this.quill.format('link', false)
                }
              }
            }
          }
        }
      },
      valid: false,
      shouldShowDatePicker: false,
      // form data.
      title: '',
      url: '',
      detail: '',
      expirationDate: null,
      category: '',
      tags: '',
      // image attachments.
      attachments: [],
      files: [],
      data: []
    }
  },
  computed: {
    ...mapGetters({
      categoryNames: 'deals/categoriesName',
      deal: 'deals/deal',
      formData: 'deals/formData'
    }),
    today() {
      return new Date().toISOString().substring(0, 10)
    },
    inputedTags() {
      return [] /*this.tags
        .split(',')
        .filter(tag => tag.length > 0)
        .unique()*/
    }
  },
  methods: {
    onEditorChange({ quill, html, text }) {
      this.detail = html
    },
    onChangeFile() {
      this.data = []
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].size < 1048576) {
          const reader = new FileReader()
          const self = this
          reader.onload = function(e) {
            self.data.push(e.target.result)
          }
          reader.readAsDataURL(this.files[i])
        }
      }
    },
    cancel() {
      this.$router.back()
    },
    confirm() {
      this.$store.dispatch('deals/updateForm', {
        formData: {
          title: this.title,
          url: this.url,
          detail: this.detail,
          expirationDate: this.expirationDate,
          category: this.category,
          tags: this.tags,
          images: {
            files: this.files,
            data: this.data
          }
        }
      })
      this.$router.push(this.localePath({ name: 'deals-confirm' }))
    }
  },
  mounted() {
    // form data.
    this.title = this.deal.title
    this.url = this.deal.link
    this.detail = this.deal.detail
    this.expirationDate = this.deal.expired_on
    this.category = this.deal.category_value
    this.tags = this.deal.tags
    // image attachments.
    this.attachments = this.deal.attachments
    this.onChangeFile()
  }
}
</script>
