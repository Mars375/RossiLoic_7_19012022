<template>
  <div class="content">
    <div class="createPost flex">
      <router-link :to="{ name: 'NewPost' }">
        <v-btn color="button" class="button"><v-icon>mdi-plus</v-icon>Crée un post</v-btn>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
};
</script>

<style lang="sass" scoped>

.createPost
  width: 100%
  justify-content: center
  align-items: center

.button
  display: inherit
  color: white !important
  cursor: pointer

</style>
