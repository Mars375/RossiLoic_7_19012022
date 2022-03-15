<template>
  <v-main class="home">
    <v-container class="pa-0 mt-4">
      <CreatePost v-if="isLoggedIn" />
      <v-container v-if="loading">
        <v-skeleton-loader
          :loading="loading"
          v-bind="attrs"
          type="list-item-avatar-two-line, image, article"
          v-for="post in posts"
          :key="post.id"
          max-width="602"
        >
        </v-skeleton-loader>
      </v-container>
      <v-container v-else class="pa-0 mt-4">
        <v-card
          max-width="602"
          class="mb-8 mx-auto"
          v-for="post in posts"
          :key="post.id"
        >
          <v-col class="pa-0">
            <v-card-actions>
              <v-list-item-avatar>
                <v-img
                  :src="users.find((user) => user.id === post.UserId).picture"
                ></v-img>
              </v-list-item-avatar>
              <v-list-item two-line class="pa-0">
                <v-list-item-content class="d-block">
                  <v-list-item-title
                    >{{
                      users.find((user) => user.id === post.UserId).firstname
                    }}
                    {{
                      users.find((user) => user.id === post.UserId).lastname
                    }}</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    users.find((user) => user.id === post.UserId).username
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn dark icon v-bind="attrs" v-on="on">
                    <v-icon color="button">mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title class="d-flex" @click="post.editing = true && $forceUpdate()"
                      >Modifier le Post</v-list-item-title
                    >
                  </v-list-item>
                  <v-divider width="90%" class="ma-auto"></v-divider>
                  <v-list-item>
                    <v-list-item-title>Supprimer le Post</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
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
          <EditPost v-if="post.editing" :post="post" :user="users.find((user) => user.id === post.UserId)"/>
        </v-card>
      </v-container>
    </v-container>
  </v-main>
</template>

<script>
// @ is an alias to /src
import { mapState, mapGetters } from "vuex";
import CreatePost from "../components/CreatePost.vue";
import EditPost from "../components/EditPost.vue";

export default {
  data() {
    return {
      postEditing: false,
      loading: true,
      postContent: "",
      posts: [],
      users: [],
      fileextension: ["jpg", "jpeg", "png", "gif", "webp"],

      attrs: {
        class: "mb-6",
        elevation: 2,
      },
    };
  },
  name: "Home",
  components: {
    CreatePost,
    EditPost,
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
    ...mapState({ user: "user" }),
  },
  methods: {
    isImage(postFile) {
      return this.fileextension.includes(postFile.split(".").pop());
    },
  },
  async mounted() {
    try {
      const response = await fetch(
        `${location.protocol}//${location.hostname}:3000/post`
      );
      this.posts = await response.json();
      this.posts = this.posts.posts;
      for (const post of this.posts) {
        if (!this.users.find((user) => user.id == post.UserId)) {
          const response = await fetch(
            `${location.protocol}//${location.hostname}:3000/user/${post.UserId}`
          );
          if (response.ok) {
            const user = await response.json();
            this.users.push(user);
          }
        }
      }
      this.loading = false;
    } catch (error) {
      console.error(error);
    }
  },
};
</script>

<style lang="sass" scoped>
img
  fit-content: cover
.v-list-item__content
  width: fit-content
  flex: none

.home
  width: 100%
  background-color: #DAE0E6

  > .v-main__wrap
    position: inherit
</style>
