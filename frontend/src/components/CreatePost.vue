<template>
  <div class="content">
    <div class="createPost flex">
      <router-link :to="{ name: 'NewPost' }" class="flex button">
        <font-awesome-icon icon="plus" />
        <h2>Crée un post</h2>
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
  border: 1px solid var(--orange)
  background-color: var(--orange)
  color: white
  padding: 10px 20px
  border-radius: 15px
  cursor: pointer
  font-weight: bold
  max-width: fit-content

  > svg
    margin-right: 10px
</style>
