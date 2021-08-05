<template>
  <client-only>
    <v-card color="rgb(255,255,255,0.5)">
      <v-card-title class="title">Post Deal</v-card-title>
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
          <v-text-field v-model="url" :error-messages="errors" :success="valid" label="Link" />
        </ValidationProvider>
        <div>
          <span class="label">Detail</span>
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
                :error-messages="errors"
                :success="valid"
                v-on="on"
                label="Expired date"
                readonly
                required
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
          required
        />
        <v-text-field v-model="tags" label="Tags" hint="Use comma(,) to separate each tag." />
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
        <v-divider />
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
        <v-btn @click="cancel" text color="orange">Cancel</v-btn>
        <v-spacer />
        <v-btn @click="confirm" color="blue white--text text-none">Confirm</v-btn>
      </v-card-actions>
    </v-card>
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
      files: [],
      data: []
    }
  },
  computed: {
    ...mapGetters({
      categories: 'deals/categories',
      categoryNames: 'deals/categoriesName',
      formData: 'deals/formData'
    }),
    today() {
      return new Date().toISOString().substring(0, 10)
    },
    inputedTags() {
      return this.tags.length > 0
        ? this.tags
            .split(',')
            .filter(tag => tag.length > 0)
            .unique()
        : []
    }
  },
  methods: {
    ...mapActions('deals', ['updateForm']),
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
    async confirm() {
      const isValid = await this.$validator.validateAll()
      if (isValid) {
        this.updateForm({
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
        })
        this.$router.push(this.localePath({ name: 'deals-new-confirm' }))
      }
    }
  },
  mounted() {
    // form data.
    this.title = this.formData.title
    this.url = this.formData.url
    this.detail = this.formData.detail
    this.expirationDate = this.formData.expirationDate
    this.category = this.formData.category
    this.tags = this.formData.tags
    // image attachments.
    this.files = this.formData.images.files
    this.onChangeFile()
  }
}
</script>
