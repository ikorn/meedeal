<template>
  <v-simple-table v-if="deals">
    <thead>
      <tr>
        <th>Title</th>
        <th class="text-center hidden-sm-and-down">Posted By</th>
        <th class="text-center hidden-sm-and-down">Posted On</th>
        <th class="text-center hidden-md-and-up">Posted By</th>
        <th class="text-center hidden-sm-and-down">Votes</th>
        <th class="text-center hidden-sm-and-down">Views</th>
        <th class="text-center hidden-sm-and-down">Comments</th>
        <th class="text-center hidden-md-and-up">Statistics</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(deal, row) in deals" :key="row">
        <td>
          <a @click="onClick(deal.id)">{{ deal.title | truncate(50) }}</a>
          <v-chip small v-show="deal.is_expired" color="red" class="white--text">expired</v-chip>
        </td>
        <td class="text-center hidden-sm-and-down">{{ deal.posted_by.display_name }}</td>
        <td class="text-center hidden-sm-and-down">{{ deal.posted_on | dateFormat('MM/DD/YYYY') }}</td>
        <td class="hidden-md-and-up">
          <v-icon small left color="grey lighten-1">fa-user</v-icon>
          {{ deal.posted_by.display_name }}
          <br />
          <v-icon small left color="grey lighten-1">fa-calendar</v-icon>
          {{ deal.posted_on | dateFormat('MM/DD/YYYY') }}
        </td>
        <td class="text-center hidden-sm-and-down">{{ deal.votes }}</td>
        <td class="text-center hidden-sm-and-down">{{ deal.views_count }}</td>
        <td class="text-center hidden-sm-and-down">{{ deal.comments_count }}</td>
        <td class="hidden-md-and-up">
          <v-icon small left color="grey lighten-1">fa-thumbs-up</v-icon>
          {{ deal.votes }}
          <br />
          <v-icon small left color="grey lighten-1">fa-eye</v-icon>
          {{ deal.views_count }}
          <br />
          <v-icon small left color="grey lighten-1">fa-comment</v-icon>
          {{ deal.comments_count }}
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>
<script>
export default {
  props: ['deals'],
  methods: {
    onClick(id) {
      this.$emit('clicked', id)
    }
  }
}
</script>

