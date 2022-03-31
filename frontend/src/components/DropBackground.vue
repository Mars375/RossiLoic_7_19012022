<template>
  <div>
    <v-btn icon @click="uploadBg = !uploadBg"><v-icon color="button">mdi-camera-plus</v-icon></v-btn>
    <div class="fondBackground" @click="uploadBg = false" v-if="uploadBg"></div>
    <div class="layer" v-if="uploadBg">
      <div class="d-flex justify-space-between align-center pa-2">
        <h2 class="font-weight-bold">Sélectionner une image</h2>
        <v-btn icon @click="uploadBg = false"><v-icon small>mdi-window-close</v-icon></v-btn>
      </div>
      <div class="cardAddImg flex" v-if="!selectedFile">
        <div class="contentCircle flex">
          <svg
            height="20"
            viewBox="0 0 18 18"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" fill-rule="evenodd">
              <path d="m0 0h18v18h-18z" />
              <path
                d="m13.5 8.25v4.5c0 .8284271-.6715729 1.5-1.5 1.5h-10.5c-.82842712 0-1.5-.6715729-1.5-1.5v-10.5c0-.82842712.67157288-1.5 1.5-1.5h7.5-3v1.5h-4.5v10.5h10.5v-4.5zm-5.28-.5325 2.655 3.5325h-8.25l2.0625-2.6475 1.47 1.77zm3.78-5.4675h2.25v1.5h-2.25v2.25h-1.5v-2.25h-2.25v-1.5h2.25v-2.25h1.5z"
                fill="#000"
                transform="translate(2.25 1.5)"
              />
            </g>
          </svg>
        </div>
        <h2>Uploader un fichier</h2>
      </div>
      <div class="cardAddImg flex" v-else>
        <img :src="imageUrl" />
      </div>
      <div class="flex"></div>
      <input
        class="fileInput"
        type="file"
        accept=".jpg, .jpeg, .png, .gif, .webp"
        @change="onFileSelected"
      />
      <v-btn @click="upload()" color="button" class="upload">Appliquer</v-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DropBackground",
  data() {
    return {
      uploadBg: false,
      selectedFile: null,
      imageUrl: null,
      newBackground: null,
    };
  },
  computed: {
    ...mapState({ user: "user" }),
  },
  methods: {
    async upload() {
      const formData = new FormData();
      formData.append("image", this.selectedFile, this.selectedFile.name);
      try {
        const params = {
          method: "PUT",
          credentials: "include",
          body: formData,
        };
        await fetch(
          `${location.protocol}//${location.hostname}:3000/user/${this.user.id}/background`,
          params
        );
        await this.$router.go();
      } catch (error) {
        console.log(error);
      }
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      var urlCreator = window.URL || window.webkitURL;
      this.imageUrl = urlCreator.createObjectURL(this.selectedFile);
    },
  },
};
</script>

<style lang="sass" scoped>

.v-btn
  background-color: white

div
  user-select: none

.fondBackground
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(255, 255, 255, 0.5)

.fa-camera-retro
  margin-top: 5px
  width: 16px
  color: #fe8067

.layer
  position: fixed
  width: 300px
  height: 305px
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  background-color: white
  border-radius: 5px
  box-shadow: 1px 1px 5px var(--lightblack)
  z-index: 1

.header
  justify-content: space-between
  padding: 20px
  font-size: 20px
  font-weight: bold
  align-items: center

  > button > svg
    width: 18px
    height: 18px

.cardAddImg
  width: 200px
  height: 200px
  background-color: var(--salmon)
  border-radius: 4px
  margin: auto
  padding: 10px
  flex-direction: column

  > h2
    padding: 10px
    font-size: 16px
    font-weight: bold

  > img
    width: 180px
    height: 180px
    object-fit: cover

.contentCircle
  align-content: center
  justify-content: center
  margin: auto
  width: 135px
  height: 135px
  border-radius: 130px
  background-color: white

  > svg
    margin: auto
    max-width: 30px
    max-height: 30px

.fileInput
  position: absolute
  top: 60px
  left: 50px
  width: 200px
  height: 200px
  opacity: 0

.upload
  color: white
  margin: 7px
</style>
