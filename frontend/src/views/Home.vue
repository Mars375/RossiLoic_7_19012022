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
        <Post v-for="post in posts" :key="post.id" :post="post" :users="users"/>
      </v-container>
    </v-container>
  </v-main>
</template>

<script>
// @ is an alias to /src
import { mapState, mapGetters } from "vuex";
import CreatePost from "../components/CreatePost.vue";
import Post from "../components/Post.vue";

export default {
  data() {
    return {
      loading: true,
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
    Post,
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
    if (this.user) {
      setTimeout(() => {
        for (const post of this.posts) {
          if (post.Users.find((user) => this.user.id == user.Like.userId)) {
            const likes = document.querySelector(`#likeBtn${post.id}`);
            likes.setAttribute("style", "color: var(--orange) !important");
          }
        }
      }, 700);
    }
    try {
      const response = await fetch(
        `${location.protocol}//${location.hostname}:3000/post`
      );
      this.posts = await response.json();
      this.posts = this.posts.posts;
    } catch (error) {
      console.error(error);
    }
    try {
      const fetchResponse = await fetch(
        `${location.protocol}//${location.hostname}:3000/user/`
      );
      if (fetchResponse.ok) this.users = await fetchResponse.json();
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

.home
  width: 100%
  background-color: #DAE0E6

  > .v-main__wrap
    position: inherit
</style>
