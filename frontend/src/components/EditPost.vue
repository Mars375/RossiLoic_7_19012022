<template>
  <v-overlay :dark="false" :z-index="zIndex" color="white"> 
    <v-container class="pa-0 mt-4">
      <v-card max-width="602" class="mb-8 mx-auto">
        <v-col class="pa-0">
          <v-card-actions>
            <v-list-item-avatar>
              <v-img :src="user.picture"></v-img>
            </v-list-item-avatar>
            <v-list-item two-line class="pa-0">
              <v-list-item-content class="d-block">
                <v-list-item-title
                  >{{ user.firstname }} {{ user.lastname }}</v-list-item-title
                >
                <v-list-item-subtitle>{{ user.username }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card-actions>
          <v-img
            :src="post.attachment"
            max-height="300px"
            contain
            dark
            v-if="isImage(post.attachment)"
          />
          <video width="100%" :src="post.attachment" controls v-else></video>
          <v-card-title> {{ post.title }} </v-card-title>
          <v-card-text> {{ post.content }} </v-card-text>
        </v-col>
      </v-card>
    </v-container>
  </v-overlay>
</template>

<script>
export default {
  data() {
    return {
      zIndex: 2,
      dark: false,
      fileextension: ["jpg", "jpeg", "png", "gif", "webp"],
    };
  },
  props: {
    user: Object,
    post: Object,
  },
  methods: {
    isImage(postFile) {
      return this.fileextension.includes(postFile.split(".").pop());
    },
  },
};
</script>
