<template>
  <div class="newPost">
    <div class="titleContent">
      <h2>Crée un post</h2>
    </div>
    <div class="postContent">
      <div class="select">
        <textarea maxlength="255" placeholder="Titre"></textarea>
        <div class="nbLetter"></div>
        <label for="tag" class="label">Tag : </label>
        <input type="text" v-model="tag" id="tag" name="tag" placeholder=" " />
        <label for="fileInput" class="label">Img/video </label>
        <textarea maxlength="255" placeholder="Contenu"></textarea>
        <input
          id="fileInput"
          type="file"
          accept=".jpg, .jpeg, .png, .gif, .webp, .x-msvideo, .mp4, .mpeg, .ogg, .mp2t, .webm, 3gpp, 3gpp2"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      tag: "",
    };
  },
  async created() {
    if (!this.isLoggedIn) await this.$router.push({ name: "Home" });
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
};
</script>

<style lang="sass" scoped>

.newPost
  max-width: 70%
  margin: 52px auto 0 auto


.titleContent
  width: 100%
  padding: 20px
  border-bottom: 1px solid var(--lightblack)
  font-size: 18px
  font-weight: bold

  > h2
    text-align: left
</style>
