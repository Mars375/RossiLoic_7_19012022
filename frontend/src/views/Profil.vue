<template>
  <main class="flex">
    <section class="flex profilUser" v-if="loaded">
      <img
        :src="profil.background"
        class="backgroundImg"
        alt="image d'arrière plan de l'utilisateur"
      />
      <DropBackground
        v-if="isLoggedIn && (user.id == $route.params.id || user.admin == true)"
        class="dropBackground"
      />
      <div class="pfpContent">
        <img
          :src="profil.picture"
          class="pfp"
          alt="image de profil de l'utilisateur"
        />
      </div>
      <v-btn
        small
        outlined
        color="button"
        class="profilButton background"
        v-if="isFollow($route.params.id) && isNotHimself($route.params.id)"
        @click="unfollow($route.params.id, $event)"
        >Unfollow</v-btn
      >
      <v-btn
        small
        color="button"
        v-else-if="isNotHimself($route.params.id)"
        @click="follow($route.params.id)"
        class="profilButton color"
        >Follow</v-btn
      >
      <article id="idCard">
        <div class="cardHeader flex">
          <h2 class="name">{{ profil.firstname }} {{ profil.lastname }}</h2>
        </div>
        <p>@{{ profil.username }}</p>
        <div class="flex createdAt">
          <font-awesome-icon class="icon calendar" icon="calendar-alt" /><span>
            Créé le {{ profil.createdAt.toLocaleString() }}
          </span>
        </div>
        <div class="follow">
          <router-link :to="{ name: 'Follower' }" class="follows"
            ><span v-if="loaded">{{ followProfil.userFollower.length }}</span>
            followers</router-link
          >
          <router-link :to="{ name: 'Following' }" class="follows"
            ><span v-if="loaded">{{ followProfil.userFollowing.length }}</span>
            following</router-link
          >
        </div>
        <p class="bioUser">{{ profil.bio }} 🥜</p>
        <EditUser
          v-if="
            isLoggedIn && (user.id == $route.params.id || user.admin == true)
          "
        />
      </article>
    </section>
    <v-container class="pa-0 mt-4">
      <CreatePost v-if="isLoggedIn && $route.params.id == this.user.id" />
      <v-container v-if="loading">
        <v-skeleton-loader
          :loading="loading"
          v-bind="attrs"
          type="list-item-avatar-two-line, image, article"
          v-for="post in posts"
          :key="post.id"
          max-width="602"
        >
        </v-skeleton-loader>
      </v-container>
      <v-container v-else class="pa-0 mt-4">
        <Post
          v-for="post in posts"
          :key="post.id"
          :post="post"
          :users="users"
        />
      </v-container>
    </v-container>
  </main>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import DropBackground from "../components/DropBackground.vue";
import EditUser from "../components/EditUser.vue";
import Post from "../components/Post.vue";
import CreatePost from "../components/CreatePost.vue";
import { mixin as clickaway } from "vue-clickaway";

export default {
  mixins: [clickaway],
  data() {
    return {
      loading: true,
      popup: false,
      profil: {},
      posts: {},
      follows: {},
      filterUser: {},
      selectedFile: null,
      followProfil: {
        userFollower: [],
        userFollowing: [],
      },

      attrs: {
        class: "mb-6",
        elevation: 2,
      },
      settings: {
        method: "PATCH",
        credentials: "include",
      },
      loaded: false,
    };
  },
  name: "Profil",
  components: {
    DropBackground,
    EditUser,
    Post,
    CreatePost,
  },
  computed: {
    ...mapState({ user: "user" }),
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    isNotHimself(id) {
      if (this.isLoggedIn) if (id != this.user.id) return true;
      return false;
    },
    isFollow(id) {
      if (this.isLoggedIn)
        if (
          setTimeout(
            () =>
              this.follows.userFollowing.some((f) => {
                id == f.personBeingFollowed;
              }),
            600
          )
        )
          return true;
    },
    async follow(id) {
      try {
        await fetch(
          `${location.protocol}//${location.hostname}:3000/user/follow/${id}`,
          this.settings
        );
        this.follows.userFollowing.push({
          personBeingFollowed: id,
          personFollowing: this.user.id,
        });
      } catch (error) {
        console.log(error);
      }
    },
    async unfollow(id, event) {
      try {
        await fetch(
          `${location.protocol}//${location.hostname}:3000/user/unfollow/${id}`,
          this.settings
        );
        this.follows.userFollowing.splice(
          this.follows.userFollowing.indexOf(event),
          1
        );
      } catch (error) {
        console.log(error);
      }
    },
    async initData() {
      try {
        const response = await fetch(
          `${location.protocol}//${location.hostname}:3000/user/${this.$route.params.id}`
        );
        this.profil = await response.json();
        this.profil.createdAt = new Date(this.profil.createdAt);
      } catch (error) {
        console.log(error);
      }
      try {
        const fetchResponse = await fetch(
          `${location.protocol}//${location.hostname}:3000/user/`
        );
        if (fetchResponse.ok) this.users = await fetchResponse.json();
      } catch (error) {
        console.error(error);
      }
      try {
        const response = await fetch(
          `${location.protocol}//${location.hostname}:3000/post/user/${this.$route.params.id}`
        );
        if (response.ok)
          this.posts = await response.json();
        this.posts = this.posts.posts;
      } catch (error) {
        console.log(error);
      }
      try {
        const response = await fetch(
          `${location.protocol}//${location.hostname}:3000/user/follow/${this.$route.params.id}`
        );
        this.followProfil = await response.json();
        this.loaded = true;
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    this.initData();

    this.$watch(() => this.$route.params, this.initData);
    try {
      const response = await fetch(
        `${location.protocol}//${location.hostname}:3000/user/follow/${this.$route.params.id}`
      );
      this.follows = await response.json();
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="sass" scoped>
main
  display: flex
  flex-direction: column

.profilUser
  flex-direction: column
  width: 100%
  background-color: var(--salmon)
  z-index: 1
  flex: none

  > .dropBackground
    width: 30px
    height: 30px
    border-radius: 30px
    cursor: pointer
    position: absolute
    top: 210px
    right: 25px
    z-index: 1

.pfpContent
  width: fit-content
  align-self: center
  height: 150px
  margin-top: -40px

p
  font-size: 12px

.createdAt
  margin-top: 10px

.follow
  margin-top: 10px

.pfp
  background-color: var(--salmon)
  width: 150px
  height: 150px
  border-radius: 100%
  align-self: center

.backgroundImg
  object-fit: cover
  width: 100%
  height: 200px

#idCard
  margin-top: 20px
  flex-direction: column
  align-self: center
  background-color: white
  width: 100%
  padding: 30px
  border-bottom: 1px solid var(--lightblack)

  > div
    align-items: center
    justify-content: center
    font-size: 12px

    > .calendar
      font-size: 14px
      margin-right: 5px

.cardHeader
  justify-content: center

  > h2
    font-size: 25px
    font-weight: bold

  > div
    color: #666666

.bioUser
  margin: 20px 0 35px 0
  font-size: 18px

.posts

  > div
    padding: 20px 0
    margin: 6px auto
    border-radius: 20px
    background-color: white
    box-shadow: 1px 1px 5px black

    > img
      max-height: 25%
      max-width: 25%
      max-width: 50%

.follows
  cursor: pointer
  margin-right: 10px

  &:hover
    text-decoration: underline

  > span
    color: var(--orange)
    font-weight: bold
    font-size: 14px

.profilButton
  position: absolute
  top: 280px
  right: 20px

.color
  color: white !important

.background
  background-color: white !important
</style>
