<template>
  <div class="newPost">
    <div class="titleContent flex">
      <h2>Crée un post</h2>
    </div>
    <v-app id="inspire">
      <v-container fluid>
        <v-combobox
          v-model="model"
          :filter="filter"
          :hide-no-data="!search"
          :items="items"
          :search-input.sync="search"
          hide-selected
          label="Choisissez une catégorie"
          multiple
          small-chips
          solo
          height="60px"
          class="ma-auto"
        >
          <template v-slot:no-data>
            <v-list-item active-class="listpouet">
              <span class="subheading">Create</span>
              <v-chip :color="`${colors[nonce - 1]} lighten-3`" label small>
                {{ search }}
              </v-chip>
            </v-list-item>
          </template>
          <template v-slot:selection="{ attrs, item, parent, selected }">
            <v-chip
              v-if="item === Object(item)"
              v-bind="attrs"
              :color="`${item.color} lighten-3`"
              :input-value="selected"
              label
              small
            >
              <span class="pr-2">
                {{ item.text }}
              </span>
              <v-icon small @click="parent.selectItem(item)"> $delete </v-icon>
            </v-chip>
          </template>
          <template v-slot:item="{ index, item }">
            <v-text-field
              v-if="editing === item"
              v-model="editing.text"
              autofocus
              flat
              background-color="transparent"
              hide-details
              solo
              @keyup.enter="edit(index, item)"
            ></v-text-field>
            <v-chip v-else :color="`${item.color} lighten-3`" dark label small>
              {{ item.text }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-list-item-action @click.stop>
              <v-btn icon @click.stop.prevent="edit(index, item)">
                <v-icon>{{
                  editing !== item ? "mdi-pencil" : "mdi-check"
                }}</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-combobox>
      </v-container>
      <div class="postContent">
        <div>
          <v-text-field
            color="input"
            class="app-text-field ma-auto mb-4"
            v-model="title"
            :rules="[rules.required, rules.counter, rules.minima]"
            label="Title"
            counter
            maxlength="255"
            clearable
            hide-details="auto"
          ></v-text-field>
        </div>
        <div>
          <v-textarea
            v-model="content"
            id="content"
            auto-grow
            counter
            clearable
            color="input"
          >
            <template v-slot:label>
              <div>Que voulez-vous dire ? <small>(optionnel)</small></div>
            </template>
          </v-textarea>
        </div>
        <div class="postPicture">
          <v-file-input
            prepend-icon="mdi-image-plus"
            color="var(--orange)"
            accept="image/jpg, image/jpeg, image/png, image/gif, video/x-msvideo, video/mp4, video/mpeg, video/ogg, video/mp2t, video/webm, video/3gpp, video/3gpp2"
            @change="Preview_image"
            v-model="image"
          ></v-file-input>
          <v-img
            contain
            max-height="300px"
            :src="url"
            v-if="url && isImage(this.image.name)"
          ></v-img>
          <video
            height="300px"
            width="500px"
            :src="url"
            controls
            v-else-if="url"
          ></video>
        </div>
        <v-btn
          color="var(--orange)"
          elevation="1"
          outlined
          @click="createPost()"
          >Post</v-btn
        >
      </div>
    </v-app>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      activator: null,
      attach: null,
      colors: ["green", "purple", "indigo", "cyan", "teal", "orange"],
      editing: null,
      editingIndex: -1,
      items: [
        { header: "Selectionnez une categorie ou créez en une" },
        {
          text: "Animaux",
          color: "blue",
        },
        {
          text: "Musique",
          color: "red",
        },
      ],
      fileextension: ["jpg", "jpeg", "png", "gif", "webp"],
      nonce: 1,
      menu: false,
      model: [],
      x: 0,
      search: null,
      y: 0,

      title: "",
      content: "",
      url: null,
      image: null,

      rules: {
        required: (value) => !!value || "Required.",
        counter: (value) => value.length <= 255 || "Max 255 characters",
        minima: (value) => value.length >= 2 || "Min 2 characters",
      },
    };
  },
  watch: {
    model(val, prev) {
      if (val.length === prev.length) return;
      this.model = val.map((v) => {
        if (typeof v === "string") {
          v = {
            text: v,
            color: this.colors[this.nonce - 1],
          };
          if (this.model.length < 6) this.items.push(v);

          this.nonce++;
        }

        return v;
      });
    },
  },
  async created() {
    if (!this.isLoggedIn) await this.$router.push({ name: "Home" });
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    edit(index, item) {
      if (!this.editing) {
        this.editing = item;
        this.editingIndex = index;
      } else {
        this.editing = null;
        this.editingIndex = -1;
      }
    },
    isImage(file) {
      return this.fileextension.includes(file.split(".").pop());
    },
    filter(item, queryText, itemText) {
      if (item.header) return false;

      const hasValue = (val) => (val != null ? val : "");

      const text = hasValue(itemText);
      const query = hasValue(queryText);

      return (
        text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) >
        -1
      );
    },
    async createPost() {
      const post = {
        title: this.title,
        content: this.content,
      };
      if (!this.model.length)
        return console.error("Aucune categorie selectionner");
      const formData = new FormData();
      formData.append("image", this.image);
      formData.append("post", JSON.stringify(post));
      formData.append(
        "category",
        this.model.map((e) => (e = e.text)).join(";")
      );
      const settings = {
        method: "POST",
        credentials: "include",
        body: formData,
      };
      try {
        const fetchResponse = await fetch(
          `${location.protocol}//${location.hostname}:3000/post`,
          settings
        );
        const data = await fetchResponse.json();
        alert(data.message);
        await this.$router.push({ name: "Home" });
      } catch (error) {
        console.log(error);
        return;
      }
    },
    Preview_image() {
      if (!this.image) return (this.url = null);
      this.url = URL.createObjectURL(this.image);
    },
  },
};
</script>

<style lang="sass" scoped>

#tag
  height: 120px

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
    border: 1px solid var(--orange)

.newPost
  width: 95%
  max-width: 700px
  margin: 20px auto


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
  z-index: 0

  > div
    position: relative
    z-index: 0

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

.v-btn
  margin-top: 20px
</style>
