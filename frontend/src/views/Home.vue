<template>
  <main class="home">
    <p>Je suis un post</p>
  </main>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";
export default {
  data() {
    return {
      postContent: ""
    }
  },
  name: "Home",
  components: {
    // HelloWorld
  },
  computed: {
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
