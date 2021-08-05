<template>
  <v-card flat color="rgb(255,255,255,0.5)">
    <v-card-title class="title">My Account</v-card-title>
    <v-divider />
    <v-card-text>
      <v-card flat>
        <v-container class="black--text text-center">
          <v-row no-gutters>
            <v-col>
              <v-icon color="blue">fa-trophy</v-icon>
              <h4>Level</h4>
              {{ user.level }}
            </v-col>
            <v-divider vertical />
            <v-col>
              <v-icon color="blue">fa-star</v-icon>
              <h4>Reputation</h4>
              {{ user.reputation }}
            </v-col>
            <v-divider vertical />
            <v-col>
              <v-icon color="blue">fa-comments</v-icon>
              <h4>Number of posts</h4>
              {{ user.post_count }}
            </v-col>
          </v-row>
        </v-container>
      </v-card>

      <v-list two-line subheader rounded color="rgb(255,255,255,0)">
        <v-subheader class="font-weight-bold teal--text">
          <v-icon small left color="teal">fa-user</v-icon>User Info.
        </v-subheader>
        <v-divider />
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Name</v-list-item-title>
            <v-list-item-subtitle>{{ user.first_name }} {{ user.last_name}}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <d-profile />
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Display name</v-list-item-title>
            <v-list-item-subtitle>{{ user.display_name }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <d-profile />
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Signature</v-list-item-title>
            <v-list-item-subtitle>{{ user.signature }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <d-profile />
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Joined At</v-list-item-title>
            <v-list-item-subtitle>{{ user.created_at | dateFormat('DD/MM/YYYY') }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-subheader class="font-weight-bold teal--text">
          <v-icon small left color="teal">fa-user</v-icon>Account Info.
        </v-subheader>
        <v-divider />
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>E-mail</v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <d-email />
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Password</v-list-item-title>
            <v-list-item-subtitle>******</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <d-password />
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import UpdateEmail from '@/components/user/email'
import UpdatePassword from '@/components/user/password'
import UpdateProfile from '@/components/user/profile'
export default {
  middleware: 'auth',
  components: {
    'd-email': UpdateEmail,
    'd-password': UpdatePassword,
    'd-profile': UpdateProfile
  },
  async asyncData({ params, store }) {
    const isSuccess = await store.dispatch('user/fetchCurrentUser')
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
  }
}
</script>
