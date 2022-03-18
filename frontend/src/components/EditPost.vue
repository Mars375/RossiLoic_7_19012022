<template>
  <v-overlay :dark="false" :z-index="zIndex" color="white">
    <v-container class="pa-0">
      <v-card height="100%">
        <v-card-title class="d-flex justify-space-between mx-8 align-center"
          >Modifier les infos<font-awesome-icon
            icon="times"
            class="icon"
            @click="$emit('postEditing', false)"
        /></v-card-title>
        <v-divider width="90%" class="mx-auto"></v-divider>
        <v-col class="pa-0">
          <v-card-actions>
            <v-list-item-avatar>
              <v-img :src="user.picture"></v-img>
            </v-list-item-avatar>
            <v-list-item two-line class="pa-0">
              <v-list-item-content class="text-justify">
                <v-list-item-title
                  >{{ user.firstname }} {{ user.lastname }}</v-list-item-title
                >
                <v-list-item-subtitle
                  >@{{ user.username }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-card-actions>
          <v-container v-if="!newAttachment" class="pa-0">
            <v-img
              id="file"
              :src="post.attachment"
              max-height="200px"
              width="200px"
              contain
              dark
              v-if="isImage(post.attachment)"
              class="ma-auto"
            />
            <video
              id="file"
              max-height="400px"
              width="400px"
              :src="post.attachment"
              controls
              v-else
            ></video>
          </v-container>
          <v-container v-else class="pa-0">
            <v-img
              id="file"
              :src="imageUrl"
              max-height="200px"
              width="200px"
              contain
              dark
              v-if="isImage()"
              class="ma-auto"
            />
            <video
              id="file"
              max-height="400px"
              width="400px"
              :src="imageUrl"
              controls
              v-else
            ></video>
          </v-container>
          <v-file-input
            show-size
            truncate-length="15"
            color="input"
            class="ma-auto"
            @change="onFileSelected"
            accept="image/jpg, image/jpeg, image/png, image/gif, video/x-msvideo, video/mp4, video/mpeg, video/ogg, video/mp2t, video/webm, video/3gpp, video/3gpp2"
          ></v-file-input>
          <v-text-field
            class="app-text-field ma-auto"
            v-model="post.title"
            :rules="[rules.required, rules.counter, rules.minima]"
            label="Title"
            counter
            maxlength="255"
            clearable
            hide-details="auto"
            color="input"
          ></v-text-field>
          <v-textarea
            class="app-text-field ma-auto my-4"
            v-model="post.content"
            id="content"
            counter
            clearable
            dense
            no-resize
            height="120px"
            color="input"
          >
            <template v-slot:label>
              <div>Que voulez-vous dire ? <small>(optionnel)</small></div>
            </template>
          </v-textarea>
        </v-col>
        <v-btn color="button" elevation="1" outlined @click="editPost(post)"
          >Post</v-btn
        >
      </v-card>
    </v-container>
  </v-overlay>
</template>

<script>
export default {
  data() {
    return {
      zIndex: 2,
      dark: false,
      fileextension: ["jpg", "jpeg", "png", "gif", "webp"],
      newAttachment: "",
      title: "",
      filetype: "",

      rules: {
        required: (value) => !!value || "Required.",
        counter: (value) => value.length <= 255 || "Max 255 characters",
        minima: (value) => value.length >= 2 || "Min 2 characters",
      },
    };
  },
  props: {
    user: Object,
    post: Object,
  },
  methods: {
    isImage(postFile) {
      if (!postFile)
        return this.fileextension.includes(this.filetype.split(".").pop());
      return this.fileextension.includes(postFile.split(".").pop());
    },
    onFileSelected(event) {
      if (!event) {
        document.getElementById("file").src = this.post.attachment;
        this.newAttachment = null;
        return;
      }
      this.filetype = event.name;
      this.newAttachment = event;
      var urlCreator = window.URL || window.webkitURL;
      this.imageUrl = urlCreator.createObjectURL(this.newAttachment);
    },
    async editPost(post) {
      const updatedPost = {
        title: post.title,
        content: post.content,
      };
      const formData = new FormData();
      formData.append("image", this.newAttachment);
      formData.append("post", JSON.stringify(updatedPost));

      const settings = {
        method: "PUT",
        credentials: "include",
        body: formData,
      };

      try {
        const fetchResponse = await fetch(
          `${location.protocol}//${location.hostname}:3000/post/${post.id}`,
          settings
        );
        const data = await fetchResponse.json();
        alert(data.message);
        await this.$router.go();
      } catch (error) {
        console.log(error);
        return;
      }
    },
  },
};
</script>

<style lang="sass">

.app-text-field
  width: 90%

.v-overlay__content
  width: 100%
  height: 100%

.container
  height: 100%

.v-input
  width: 90%

video
  max-height: 400px
</style>
