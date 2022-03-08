<template>
  <main class="home">
    <CreatePost v-if="isLoggedIn"/>
  </main>
</template>

<script>
// @ is an alias to /src
import { mapState, mapGetters } from "vuex";
import CreatePost from '../components/CreatePost.vue'
export default {
  data() {
    return {
      postContent: ""
    }
  },
  name: "Home",
  components: {
    CreatePost
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
    ...mapState({ user: "user" }),
  },
};
</script>

<style lang="sass" scoped>
.home
  margin-top: 52px
  width: 100%
  background-color: #DAE0E6
</style>
