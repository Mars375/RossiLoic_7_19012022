<template>
  <v-card max-width="602" class="mb-8 mx-auto">
    <v-col class="pa-0" @click="$router.push(`/post/${post.id}`)">
      <v-card-actions>
        <v-list-item-avatar
          @click.stop="redirectFromPost"
        >
          <v-img
            :src="users.find((user) => user.id === post.UserId).picture"
          ></v-img>
        </v-list-item-avatar>
        <v-list-item two-line class="pa-0">
          <v-list-item-content
            class="text-justify"
            @click.stop="redirectFromPost"
          >
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
        <v-menu offset-y v-if="(isLoggedIn) && ((user.id == post.UserId) || (user.admin == true))">
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
                <v-list-item-title @click="alert = true"
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
      ><v-btn
        @click="likeComment() && (loader = 'loading1')"
        :id="'likeBtn' + post.id"
        :loading="loading1"
        :disabled="loading1"
        v-if="isLoggedIn"
        ><span>J'aime</span
        ><v-badge
          bordered
          bottom
          overlap
          left
          color="button"
          :content="post.likes"
          :value="post.likes"
          ><v-icon>mdi-heart</v-icon></v-badge
        ></v-btn
      >
      <v-btn v-else disabled
        ><span>J'aime</span
        ><v-badge
          bordered
          bottom
          overlap
          left
          color="button"
          :content="post.likes"
          :value="post.likes"
          ><v-icon>mdi-heart</v-icon></v-badge
        ></v-btn
      >
      <v-btn @click="comment = !comment" v-if="isLoggedIn"
        ><span>Commenter</span
        ><v-badge
          bordered
          bottom
          overlap
          left
          color="button"
          :content="post.Comments.length"
          :value="post.Comments.length"
          ><v-icon>mdi-comment</v-icon></v-badge
        ></v-btn
      >
      <v-btn v-else disabled
        ><span>Commenter</span
        ><v-badge
          bordered
          bottom
          overlap
          left
          color="button"
          :content="post.Comments.length"
          :value="post.Comments.length"
          ><v-icon>mdi-comment</v-icon></v-badge
        ></v-btn
      ></v-bottom-navigation
    >
    <v-divider></v-divider>
    <v-expand-transition>
      <v-text-field
        autofocus
        color="input"
        :id="post.id.toString()"
        label="Commenter"
        single-line
        clearable
        :append-outer-icon="message ? 'mdi-send' : null"
        filled
        v-if="comment && isLoggedIn"
        v-model="message"
        class="mx-auto my-2"
        @click:append-outer="sendMessage"
        @keydown.enter="sendMessage"
        hide-details="auto"
      ></v-text-field>
    </v-expand-transition>
    <v-list-item three-line dense class="d-block" v-if="post.Comments.length">
      <template v-for="comment in computedComments">
        <v-list-item :key="comment.id">
          <v-list-item-avatar
            @click="redirectFromComment"
          >
            <v-img
              :src="users.find((user) => user.id === comment.userId).picture"
            ></v-img>
          </v-list-item-avatar>
          <v-list-item-content
            class="text-justify pa-0 align-content-center mr-auto d-block my-auto"
          >
            <v-list-item-title
              @click="redirectFromComment"
              >@{{
                users.find((user) => user.id === comment.userId).username
              }}</v-list-item-title
            >
            <v-list-item-subtitle v-if="state != comment.id">{{
              comment.content
            }}</v-list-item-subtitle>
            <v-text-field
              color="input"
              v-model="comment.content"
              variant="plain"
              single-line
              solo
              clearable
              hide-details
              autofocus
              flat
              class="pa-0"
              dense
              v-if="state == comment.id"
              @click:append-outer="updateComment()"
              @keydown.enter="updateComment()"
              :append-outer-icon="comment.content ? 'mdi-send' : null"
            ></v-text-field>
          </v-list-item-content>
          <v-list-item-content
            class="pa-0 ml-auto d-block my-auto"
            v-if="(isLoggedIn) && ((user.id == comment.userId) || (user.admin == true))"
          >
            <v-icon
              class="mr-1"
              dense
              @click="state == null ? (state = comment.id) : (state = null)"
              >mdi-pencil</v-icon
            >
            <v-icon
              dense
              @click.stop="
                (alert = true) && (commentId = comment.id) && (isComment = true)
              "
              >mdi-trash-can-outline</v-icon
            >
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list-item>
    <v-btn
      @click="limit += 3"
      v-if="limit < post.Comments.length && post.Comments.length"
      class="mb-4"
      x-small
      color="button"
      outlined
      elevation="2"
      >Show more</v-btn
    >
    <v-btn
      @click="limit = 2"
      v-else-if="limit >= post.Comments.length && post.Comments.length > 2"
      class="mb-4"
      x-small
      color="button"
      outlined
      elevation="2"
      >Show Less</v-btn
    >
    <EditPost
      v-if="postEditing"
      :post="post"
      :user="users.find((user) => user.id === post.UserId)"
      @postEditing="postEditing = $event"
    />
    <v-dialog v-model="alert" width="auto">
      <v-card>
        <v-card-title class="text-h5 text-break" v-if="isComment">
          Êtes-vous sûr de vouloir supprimer ce commentaire ?
        </v-card-title>
        <v-card-title class="text-h5 text-break" v-else>
          Êtes-vous sûr de vouloir supprimer ce post ?
        </v-card-title>

        <v-card-actions class="d-block">
          <v-spacer></v-spacer>

          <v-btn color="button" text @click.stop="alert = false"> Non </v-btn>

          <v-btn
            color="button"
            text
            @click="isComment ? removeComment() : removePost()"
          >
            Oui
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="listOfUser" scrollable max-width="300px">
      <v-card>
        <v-card-title>Select Country</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px"> </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="listOfUser = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="listOfUser = false">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      message: "",
      showMore: false,
      limit: 2,
      alert: false,
      commentId: "",
      isComment: false,
      state: null,
      listOfUser: false,

      loader: null,
      loading1: false,
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

    computedComments() {
      this.sortComments();
      return this.limit
        ? this.post.Comments.slice(0, this.limit)
        : this.post.Comments;
    },
  },
  methods: {
    redirectFromComment(comment){
      location.pathname == `/profil/${comment.Userid}` ? this.$router.push(`/profil/${comment.UserId}`) : this.$router.go()
    },
    redirectFromPost(post){
      location.pathname == `/profil/${post.Userid}` ? this.$router.push(`/profil/${post.UserId}`) : this.$router.go()
    },
    async likeComment() {
      const user = this.post.Users.find(
        (user) => this.user.id == user.Like.userId
      );
      if (user) {
        const settings = {
          method: "POST",
          credentials: "include",
        };
        try {
          await fetch(
            `${location.protocol}//${location.hostname}:3000/post/${this.post.id}/dislike`,
            settings
          );
          this.post.likes--;
          this.post.Users.splice(this.post.Users.indexOf(user), 1);
          const likes = document.querySelector(`#likeBtn${this.post.id}`);
          likes.setAttribute("style", "color: rgba(0, 0, 0, 0.6) !important");
          return;
        } catch (error) {
          console.error(error);
        }
      } else {
        const settings = {
          method: "POST",
          credentials: "include",
        };
        try {
          await fetch(
            `${location.protocol}//${location.hostname}:3000/post/${this.post.id}/like`,
            settings
          );
          this.post.likes++;
          this.post.Users.push({ Like: { userId: this.user.id } });
          const likes = document.querySelector(`#likeBtn${this.post.id}`);
          likes.setAttribute("style", "color: var(--orange) !important");
        } catch (error) {
          console.error(error);
        }
      }
      if (!this.post.Users.length) {
        const settings = {
          method: "POST",
          credentials: "include",
        };

        try {
          await fetch(
            `${location.protocol}//${location.hostname}:3000/post/${this.post.id}/like`,
            settings
          );
          this.post.likes++;
          this.post.Users.push({ Like: { userId: this.user.id } });
          const likes = document.querySelector(`#likeBtn${this.post.id}`);
          likes.setAttribute("style", "color: var(--orange) !important");
        } catch (error) {
          console.error(error);
        }
      }
    },
    async updateComment() {
      const comment = this.post.Comments.find(
        (comment) => this.state == comment.id
      );
      const content = {
        content: comment.content,
      };
      const settings = {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(content),
        headers: { "Content-Type": "application/json" },
      };
      try {
        await fetch(
          `${location.protocol}//${location.hostname}:3000/post/${this.post.id}/comment/${this.state}`,
          settings
        );
      } catch (error) {
        console.error(error);
      }
      this.state = null;
    },
    async removeComment() {
      this.alert = false;
      this.post.Comments.splice(
        this.post.Comments.indexOf(
          this.post.Comments.find((comment) => this.commentId == comment.id)
        ),
        1
      );
      const settings = {
        method: "DELETE",
        credentials: "include",
      };
      try {
        await fetch(
          `${location.protocol}//${location.hostname}:3000/post/${this.post.id}/comment/${this.commentId}`,
          settings
        );
      } catch (error) {
        console.error(error);
      }
    },
    sortComments() {
      this.post.Comments.sort((a, b) => {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return bDate.getTime() - aDate.getTime();
      });
    },
    async sendMessage() {
      const content = {
        content: this.message,
      };
      const settings = {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(content),
        headers: { "Content-Type": "application/json" },
      };
      try {
        const response = await fetch(
          `${location.protocol}//${location.hostname}:3000/post/${this.post.id}/comment`,
          settings
        );
        const data = await response.json();
        this.post.Comments.push(data.comment);
        this.clearMessage();
      } catch (error) {
        console.error(error);
      }
    },
    clearMessage() {
      this.message = "";
    },
    isImage(postFile) {
      return this.fileextension.includes(postFile.split(".").pop());
    },
    async removePost() {
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
      } catch (error) {
        error;
      }
    },
  },
  mounted() {},
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 500);

      this.loader = null;
    },
  },
};
</script>

<style lang="sass" scoped>
.dropdown:hover
  background-color: var(--salmon)
  cursor: pointer
  
.v-list-item__content
  flex: none !important
  overflow: visible !important
  display: block !important
  &:active
    color: var(--orange)

.v-icon:focus
  color: var(--orange) !important

.v-badge__badge
  min-width: 15px !important
  height: 15px !important
  padding: 2px 4px !important
</style>
