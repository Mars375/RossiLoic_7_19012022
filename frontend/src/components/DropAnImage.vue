<template>
  <div>
    <font-awesome-icon
      class="icon"
      icon="camera-retro"
      @click="uploadBg = !uploadBg"
    />
    <div class="fondBackground" @click="uploadBg = false" v-if="uploadBg"></div>
    <div class="layer" v-if="uploadBg">
      <div class="flex header">
        <h1>Sélectionner une image</h1>
        <button class="close flex"><font-awesome-icon icon="times" /></button>
      </div>
      <div class="contentCircle flex">
        <div></div>
        <div>Uploader un fichier</div>
        <font-awesome-icon />
      </div>
      <div class="flex"></div>
      <input
        class="file-input"
        type="file"
        multiple
        accept=".jpg, .jpeg, .png, .gif, .webp"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "DropAnImage",
  data() {
    return {
      uploadBg: false,
      isDragging: false,
      wrongFile: false,
      imageSource: null,
    };
  },
  computed: {
    getClasses() {
      return { isDragging: this.isDragging };
    },
  },
  methods: {
    dragOver() {
      this.isDragging = true;
    },
    dragLeave() {
      this.isDragging = false;
    },
    drop(e) {
      let files = e.dataTransfer.files;
      this.wrongFile = false;
      // allows only 1 file
      if (files.length === 1) {
        let file = files[0];
        // allows image only
        if (file.type.indexOf("image/") >= 0) {
          var reader = new FileReader();
          reader.onload = (f) => {
            this.imageSource = f.target.result;
            this.isDragging = false;
          };
          reader.readAsDataURL(file);
        } else {
          this.wrongFile = true;
          this.imageSource = null;
          this.isDragging = false;
          setTimeout(() => {
            this.wrongFile = false;
          }, 1500);
        }
      }
    },
    onRequestUploadFiles() {},
  },
};
</script>

<style lang="sass" scoped>

.fondBackground
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(255, 255, 255, 0.5)

.fa-camera-retro
  margin-top: 7px

.layer
  position: fixed
  width: 400px
  height: 400px
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  background-color: white
</style>
