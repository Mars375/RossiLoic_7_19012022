<template>
  <main class="flex">
    <section class="flex profilUser" v-if="loaded">
      <img
        :src="profil.background"
        class="backgroundImg"
        alt="image d'arrière plan de l'utilisateur"
      />
      <DropBackground v-if="isLoggedIn" class="dropBackground" />
      <div class="pfpContent">
        <img
          :src="profil.picture"
          class="pfp"
          alt="image de profil de l'utilisateur"
        />
      </div>
      <button
        v-if="isFollow($route.params.id) && isNotHimself($route.params.id)"
        @click="unfollow($route.params.id, $event)"
        class="unfollowButton profilButton"
      >
        Unfollow
      </button>
      <button
        v-else-if="isNotHimself($route.params.id)"
        @click="follow($route.params.id)"
        class="profilButton followButton"
      >
        Follow
      </button>
      <article id="idCard">
        <div class="cardHeader flex"><h2 class="name">{{ profil.firstname }} {{ profil.lastname }}</h2></div>
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
        <EditUser v-if="isLoggedIn" />
      </article>
    </section>
    <div class="posts" v-if="loaded">
      <div v-for="post in posts" :key="post.id">
        <img :src="post.attachment" />
        <!-- <video :src="post.attachment"/> -->
      </div>
    </div>
  </main>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import DropBackground from "../components/DropBackground.vue";
import EditUser from "../components/EditUser.vue";
import { mixin as clickaway } from "vue-clickaway";

export default {
  mixins: [clickaway],
  data() {
    return {
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
        return this.follows.userFollowing.some((f) => {
          return id == f.personBeingFollowed;
        });
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
        const response = await fetch(
          `${location.protocol}//${location.hostname}:3000/post/user/${this.$route.params.id}`
        );
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
  width: 70px

.unfollowButton
  border: 1px solid var(--orange)
  background-color: white
  color: var(--orange)
  padding: 8px
  border-radius: 15px
  cursor: pointer
  height: 30px
  width: 80px
  font-weight: bold

.followButton
  border: 1px solid var(--orange)
  background-color: var(--orange)
  color: white
  padding: 8px
  border-radius: 15px
  cursor: pointer
  height: 30px
  width: 80px
  font-weight: bold

</style>
