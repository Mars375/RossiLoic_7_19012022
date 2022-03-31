<template>
  <v-container class="pa-0 mt-16">
    <v-container v-if="loading" class="pa-0">
      <v-skeleton-loader
        :loading="loading"
        v-bind="attrs"
        type="list-item-avatar-two-line, image, article"
        max-width="602"
      >
      </v-skeleton-loader>
    </v-container>
    <v-card max-width="602" class="mb-8 mx-auto" v-else>
      <v-col class="pa-0">
        <v-card-actions>
          <v-list-item-avatar
            @click.stop="$router.push(`/profil/${post.UserId}`)"
          >
            <v-img
              :src="users.find((user) => user.id === post.UserId).picture"
            ></v-img>
          </v-list-item-avatar>
          <v-list-item two-line class="pa-0">
            <v-list-item-content
              class="text-justify"
              @click.stop="$router.push(`/profil/${post.UserId}`)"
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
                  <v-list-item-title @click="dialog = true"
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
          v-if="isImage()"
        />
        <video width="100%" :src="post.attachment" controls v-else></video>
        <v-card-title> {{ post.title }} </v-card-title>
        <v-card-text> {{ post.content }} </v-card-text>
      </v-col>
      <v-divider></v-divider>
      <v-bottom-navigation
        class="elevation-0 justify-space-around"
        horizontal
        color="button"
        ><v-btn
          @click="likeComment() && (loader = 'loading1')"
          :id="'likeBtn' + post.id"
          :loading="loading1"
          :disabled="loading1"
          v-if="isLoggedIn"
          ><span>J'aime</span><v-icon>mdi-heart</v-icon></v-btn
        ><v-btn v-else disabled
          ><span>J'aime</span><v-icon>mdi-heart</v-icon></v-btn
        ><v-btn @click="comment = !comment" v-if="isLoggedIn"
          ><span>Commenter</span> <v-icon>mdi-comment</v-icon></v-btn
        >
        <v-btn v-else disabled
          ><span>Commenter</span> <v-icon>mdi-comment</v-icon></v-btn
        >
      </v-bottom-navigation>
      <v-divider></v-divider>
      <div class="d-flex justify-space-around pa-2">
        <span
          @click="listOfUser = true"
          v-if="post.likes <= 1"
          class="numberOfLikes"
          ><span class="bold">{{ post.likes }} </span>like</span
        >
        <span @click="listOfUser = true" v-else class="numberOfLikes"
          ><span class="bold">{{ post.likes }} </span>likes</span
        >
        <span v-if="post.Comments.length <= 1" class="numberOfLikes"
          ><span class="bold">{{ post.Comments.length }} </span
          >commentaire</span
        >
        <span v-else class="numberOfLikes"
          ><span class="bold">{{ post.Comments.length }} </span
          >commentaires</span
        >
      </div>
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
              @click="$router.push(`/profil/${comment.userId}`)"
            >
              <v-img
                :src="users.find((user) => user.id === comment.userId).picture"
              ></v-img>
            </v-list-item-avatar>
            <v-list-item-content
              class="text-justify pa-0 align-content-center mr-auto d-block my-auto"
            >
              <v-list-item-title
                @click="$router.push(`/profil/${comment.userId}`)"
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
              v-if="(isLoggedIn) && ((user.id == post.UserId) || (user.admin == true))"
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
                  (dialog = true) &&
                    (commentId = comment.id) &&
                    (isComment = true)
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
      <v-dialog v-model="dialog" width="auto">
        <v-card>
          <v-card-title class="text-h5 text-break" v-if="isComment">
            Êtes-vous sûr de vouloir supprimer ce commentaire ?
          </v-card-title>
          <v-card-title class="text-h5 text-break" v-else>
            Êtes-vous sûr de vouloir supprimer ce post ?
          </v-card-title>

          <v-card-actions class="d-block">
            <v-spacer></v-spacer>

            <v-btn color="button" text @click.stop="dialog = false">
              Non
            </v-btn>

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
      <v-dialog v-model="listOfUser" scrollable max-width="370px">
        <v-card>
          <v-card-title>Liste des utilisateurs</v-card-title>
          <v-divider></v-divider>
          <v-card-text
            v-for="user in post.Users"
            :key="user.username"
            class="d-flex px-3 py-0"
          >
            <v-list-item-avatar
              class="mr-2"
              @click="$router.push(`/profil/${user.Like.userId}`)"
            >
              <v-img :src="user.picture"></v-img>
            </v-list-item-avatar>
            <v-list-item-content
              class="text-justify pa-0 align-content-center mr-auto d-block my-auto"
            >
              <v-list-item-title
                @click="$router.push(`/profil/${user.Like.userId}`)"
                >@{{ user.username }}</v-list-item-title
              ></v-list-item-content
            >
            <v-btn
              outlined
              color="button"
              small
              class="align-self-center"
              v-if="
                alreadyFollowing(user.Like.userId) &&
                isNotHimself(user.Like.userId) &&
                isLoggedIn
              "
              @click="unfollow(user.Like.userId, $event)"
              >Unfollow</v-btn
            >
            <v-btn
              color="button"
              small
              class="align-self-center"
              v-else-if="isNotHimself(user.Like.userId) && isLoggedIn"
              @click="follow(user.Like.userId)"
              >Follow</v-btn
            >
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="listOfUser = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import EditPost from "../components/EditPost.vue";

export default {
  data() {
    return {
      post: {},
      users: [],
      fileextension: ["jpg", "jpeg", "png", "gif", "webp"],
      loader: null,
      loading1: false,

      attrs: {
        class: "mb-6",
        elevation: 2,
      },

      follows: {
        userFollower: [],
        userFollowing: [],
      },

      alert: false,
      postEditing: false,
      comment: false,
      message: "",
      showMore: false,
      limit: 2,
      dialog: false,
      commentId: "",
      isComment: false,
      state: null,
      listOfUser: false,
      loading: true,
    };
  },
  components: {
    EditPost,
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
    async unfollow(id, event) {
      const settings = {
        method: "PATCH",
        credentials: "include",
      };
      try {
        await fetch(
          `${location.protocol}//${location.hostname}:3000/user/unfollow/${id}`,
          settings
        );
        this.follows.userFollowing.splice(
          this.follows.userFollowing.indexOf(event),
          1
        );
      } catch (error) {
        console.log(error);
      }
    },
    async follow(id) {
      const settings = {
        method: "PATCH",
        credentials: "include",
      };
      try {
        await fetch(
          `${location.protocol}//${location.hostname}:3000/user/follow/${id}`,
          settings
        );
        this.follows.userFollowing.push({
          personBeingFollowed: id,
          personFollowing: this.user.id,
        });
      } catch (error) {
        console.log(error);
      }
    },
    alreadyFollowing(id) {
      return this.follows.userFollowing.find(
        (userFollowing) => userFollowing.personBeingFollowed == id
      );
    },
    isNotHimself(id) {
      if (!this.user) return;
      if (id != this.user.id) return true;
      return false;
    },
    isFollow(id) {
      return this.follows.userFollowing.some((f) => {
        return id == f.personBeingFollowed;
      });
    },
    async likeComment() {
      if (!this.user) return;
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
          this.post.Users.splice(this.post.Users.indexOf(user), 1);
          this.post.likes--;
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
      this.dialog = false;
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
    isImage() {
      if (!this.post.attachment) return;
      return this.fileextension.includes(this.post.attachment.split(".").pop());
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
  async created() {
    if (this.user) {
      setTimeout(() => {
        if (this.post.Users.find((user) => this.user.id == user.Like.userId)) {
          const likes = document.querySelector(`#likeBtn${this.post.id}`);
          likes.setAttribute("style", "color: var(--orange) !important");
        }
      }, 400);
    }
    try {
      const response = await fetch(
        `${location.protocol}//${location.hostname}:3000/user/follow/${this.user.id}`
      );
      this.follows = await response.json();
    } catch (error) {
      console.log(error);
    }
    try {
      const response = await fetch(
        `${location.protocol}//${location.hostname}:3000/post/${this.$route.params.postId}`
      );
      const data = await response.json();
      this.post = data.post;
    } catch (error) {
      error;
    }
    try {
      const response = await fetch(
        `${location.protocol}//${location.hostname}:3000/user/`
      );
      const data = await response.json();
      this.users = data;
      this.loading = false;
    } catch (error) {
      error;
    }
  },
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

.numberOfLikes:hover
  text-decoration: underline

.bold
  color: var(--orange)
  font-weight: bold

.v-application .button
  color: white

.v-list-item__content
  flex: none
</style>
