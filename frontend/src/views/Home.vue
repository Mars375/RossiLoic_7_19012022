<template>
  <v-main class="home">
    <v-container>
      <CreatePost v-if="isLoggedIn" />
      <v-skeleton-loader>
        <div v-for="(post, index) in posts" :key="post.id">
          {{ index + 1 }}
          <img :src="post.attachment" />
          <video :src="post.attachment" />
        </div>
      </v-skeleton-loader>
    </v-container>
  </v-main>
</template>

<script>
// @ is an alias to /src
import { mapState, mapGetters } from "vuex";
import CreatePost from "../components/CreatePost.vue";
export default {
  data() {
    return {
      postContent: "",
      posts: {},
    };
  },
  name: "Home",
  components: {
    CreatePost,
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
    ...mapState({ user: "user" }),
  },
  method: {},
  async created() {
    async () => {
      try {
        const response = await fetch(
          `${location.protocol}//${location.hostname}:3000/post`
        );
        this.posts = await response.json();
        console.log(this.posts);
        this.posts = this.posts.posts
      } catch (error) {
        console.log(error);
      }
    };
    // this.$watch(() => this.$route.params, this.initData);
  },
};
</script>

<style lang="sass" scoped>

.home
  width: 100%
  background-color: #DAE0E6

  > .v-main__wrap
    position: inherit
</style>
