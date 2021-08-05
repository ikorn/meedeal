<template>
  <v-card flat>
    <v-list>
      <v-list-item>
        <v-list-item-avatar>
          <img :src="owner.avatar_url" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Display name</v-list-item-title>
          <v-list-item-subtitle>{{ owner.display_name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list-item>
        <v-list-item-icon>
          <v-icon>fa-sign-in</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Joined</v-list-item-title>
          <v-list-item-subtitle>{{ owner.created_at | dateFormat("DD/MM/YYYY") }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>fa-trophy</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Level</v-list-item-title>
          <v-list-item-subtitle>{{ owner.level }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>fa-star</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Reputation</v-list-item-title>
          <v-list-item-subtitle>{{ owner.reputation }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>fa-tags</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Posts</v-list-item-title>
          <v-list-item-subtitle>{{ owner.post_count }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script>
export default {
  props: ['owner']
}
</script>
