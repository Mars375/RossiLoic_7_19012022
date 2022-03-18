<template>
  <v-card max-width="602" class="mb-8 mx-auto">
    <v-col class="pa-0">
      <v-card-actions>
        <v-list-item-avatar>
          <v-img
            :src="users.find((user) => user.id === post.UserId).picture"
          ></v-img>
        </v-list-item-avatar>
        <v-list-item two-line class="pa-0">
          <v-list-item-content class="text-justify">
            <v-list-item-title
              >{{ users.find((user) => user.id === post.UserId).firstname }}
              {{
                users.find((user) => user.id === post.UserId).lastname
              }}</v-list-item-title
            >
            <v-list-item-subtitle
              >@{{
                users.find((user) => user.id === post.UserId).username
              }}</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
        <v-menu offset-y v-if="isLoggedIn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark icon v-bind="attrs" v-on="on">
              <v-icon color="button">mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          <v-list class="pa-0">
            <v-hover>
              <v-list-item class="dropdown">
                <v-list-item-title class="d-flex" @click="postEditing = true"
                  >Modifier le Post</v-list-item-title
                >
              </v-list-item>
            </v-hover>
            <v-divider width="90%" class="ma-auto"></v-divider>
            <v-hover>
              <v-list-item class="dropdown">
                <v-list-item-title @click="removePost()"
                  >Supprimer le Post</v-list-item-title
                >
              </v-list-item>
            </v-hover>
          </v-list>
        </v-menu>
      </v-card-actions>
      <v-img
        :src="post.attachment"
        max-height="300px"
        contain
        dark
        v-if="isImage(post.attachment)"
      />
      <video width="100%" :src="post.attachment" controls v-else></video>
      <v-card-title> {{ post.title }} </v-card-title>
      <v-card-text> {{ post.content }} </v-card-text>
    </v-col>
    <v-divider></v-divider>
    <v-bottom-navigation class="elevation-0" horizontal color="button"
      ><v-btn><span>J'aime</span><v-icon>mdi-heart</v-icon></v-btn
      ><v-btn @click="(comment = !comment) && input(post.id)"
        ><span>Commenter</span><v-icon>mdi-comment</v-icon></v-btn
      ></v-bottom-navigation
    >
    <v-divider></v-divider>
    <v-expand-transition>
      <v-text-field
        color="input"
        :id="post.id.toString()"
        label="Commenter"
        single-line
        clearable
        filled
        v-show="comment"
        class="ma-auto mt-2"
        @click:append-outer="sendMessage"
      ></v-text-field>
    </v-expand-transition>

    <EditPost
      v-if="postEditing"
      :post="post"
      :user="users.find((user) => user.id === post.UserId)"
      @postEditing="postEditing = $event"
    />
  </v-card>
</template>

<script>
// @ is an alias to /src
import { mapState, mapGetters } from "vuex";
import EditPost from "./EditPost.vue";

export default {
  data() {
    return {
      postEditing: false,
      fileextension: ["jpg", "jpeg", "png", "gif", "webp"],
      comment: false,
      pouet: "id",
    };
  },
  components: {
    EditPost,
  },
  props: {
    post: Object,
    users: Array,
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
    ...mapState({ user: "user" }),
  },
  methods: {
    sendMessage() {
      this.clearMessage();
      // fetch mon commentaire
    },
    clearMessage() {
      this.message = "";
    },
    input(id) {
      setTimeout(() => {
        const field = document.getElementById(id);
        field.focus();
      }, 100);
    },
    isImage(postFile) {
      return this.fileextension.includes(postFile.split(".").pop());
    },
    async removePost() {
      if (confirm("Etes-vous sûr de vouloir supprimer votre post ?")) {
        const params = {
          method: "DELETE",
          credentials: "include",
        };
        try {
          const response = await fetch(
            `${location.protocol}//${location.hostname}:3000/post/${this.post.id}`,
            params
          );
          await response.json();
          await this.$router.go();
        } catch (error) {
          error;
        }
      }
    },
  },
  async mounted() {},
};
</script>

<style lang="sass">
.dropdown:hover
  background-color: var(--salmon)
  cursor: pointer

.container
  height: fit-content
</style>
