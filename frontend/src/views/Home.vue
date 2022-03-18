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
        <Post v-for="post in posts" :key="post.id" :post="post" :users="users">
          <Comment v-for="comment in post.Comments" :key="comment.id" :post="post" />
        </Post>
      </v-container>
    </v-container>
  </v-main>
</template>

<script>
// @ is an alias to /src
import { mapState, mapGetters } from "vuex";
import CreatePost from "../components/CreatePost.vue";
import Post from "../components/Post.vue";
import Comment from "../components/Comment.vue";

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
    Comment,
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
      console.log(this.posts);
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

.home
  width: 100%
  background-color: #DAE0E6

  > .v-main__wrap
    position: inherit
</style>
