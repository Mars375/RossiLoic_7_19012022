<template>
  <div class="newPost">
    <div class="titleContent flex">
      <h2>Crée un post</h2>
    </div>
    <div class="tag flex">
      <label for="tag" class="tagLabel">Tag</label>
      <input
        type="text"
        v-model="category"
        id="tag"
        name="tag"
        placeholder="Animaux, Jeux-vidéo, Musique ..."
      />
    </div>
    <div class="postContent">
      <div>
        <label for="title" />
        <textarea
          maxlength="255"
          placeholder="Titre"
          id="title"
          v-model="title"
          @input="autoResize($event)"
        ></textarea>
        <div class="nbLetter">{{ title.length }} / 255</div>
      </div>
      <div>
        <label for="content" />
        <textarea
          placeholder="Texte (optionnel)"
          id="content"
          @input="autoResize($event)"
          v-model="content"
        ></textarea>
      </div>
      <div class="pfpContent flex">
        <img
          :src="imageUrl"
          class="pfp"
          alt="image de profil de l'utilisateur"
          v-if="selectedFile"
        />
        <font-awesome-icon
          icon="times"
          class="icon close"
          @click="removeFile()"
          v-if="selectedFile"
        />
        <input
          id="file"
          class="fileInput"
          type="file"
          accept=".jpg, .jpeg, .png, .gif, .webp, .x-msvideo, .mp4, .mpeg, .ogg, .mp2t, .webm, 3gpp, 3gpp2"
          @change="onFileSelected"
        />
        <label for="file"></label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      category: "",
      title: "",
      content: "",
    };
  },
  async created() {
    if (!this.isLoggedIn) await this.$router.push({ name: "Home" });
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    autoResize(e) {
      e.target.style.height = "20px";
      e.target.style.height = `${e.target.scrollHeight}px`;
    },
  },
};
</script>

<style lang="sass" scoped>

textarea
  outline: none
  resize: none
  border: 1px solid var(--lightblack)
  overflow: hidden
  overflow-wrap: break-word
  line-height: 17px
  border-radius: 5px
  font-size: 16px

  &:focus
    border: 1px solid black

.newPost
  max-width: 70%
  margin: 52px auto 0 auto

.titleContent
  margin-top: 72px
  font-weight: bold
  font-size: 18px
  padding-bottom: 15px
  border-bottom: 1px solid var(--lightblack)

  > h2
    margin-left: 20px

.tag
  margin: 10px 0
  height: 40px
  border: 1px solid var(--lightblack)
  background-color: white
  border-radius: 5px
  align-items: center

  &:focus
    border: 1px solid var(--salmon)

  > label
    padding-left: 5px

  > input
    outline: none
    border: none
    padding: 10px
    width: 100%
    height: 100%
    border-radius: 5px
    font-size: 16px

.postContent
  background-color: white
  border-radius: 5px
  padding: 15px

  > div
    position: relative

#title
  padding: 8px 68px 8px 16px
  width: 100%
  box-sizing: border-box
  height: 33px

.nbLetter
  position: absolute
  right: 12px
  color: var(--darkergrey)
  top: 12px
  font-size: 12px
  font-weight: bold

#content
  margin-top: 20px
  white-space: pre-wrap
  padding: 8px 16px
  width: 100%
  min-height: 150px
  line-height: 21px
  resize: vertical

#fileInput
  display: none
</style>
