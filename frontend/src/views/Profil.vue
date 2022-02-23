<template>
  <main class="flex">
    <!-- <div class="magnifier" v-if="!loaded"></div> -->
    <section class="flex profilUser" v-if="loaded">
      <img :src="profil.background" class="background" />
      <img :src="profil.picture" class="pfp" />
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
        <h2 class="name">{{ profil.firstname }} {{ profil.lastname }}</h2>
        <p>@{{ profil.username }}</p>
        <div class="flex">
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
        <p class="bioUser">{{ profil.bio }}</p>
      </article>
    </section>
    <div class="posts" v-if="loaded">
      <div v-for="(post, index) in posts" :key="post.id">
        {{ index + 1 }}
        <img :src="post.attachment" />
      </div>
    </div>
  </main>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Profil",
  components: {},
  computed: {
    ...mapState({ user: "user" }),
  },
  methods: {
    isNotHimself(id) {
      if (id != this.user.id) return true;
      return false;
    },
    isFollow(id) {
      return this.follows.userFollowing.some((f) => {
        return id == f.personBeingFollowed;
      });
    },
    async follow(id) {
      const settings = {
        method: "PATCH",
        credentials: "include",
      };
      try {
        await fetch(`http://localhost:3000/user/follow/${id}`, settings);
        this.follows.userFollowing.push({
          personBeingFollowed: id,
          personFollowing: this.user.id,
        });
      } catch (error) {
        console.log(error);
      }
    },
    async unfollow(id, event) {
      const settings = {
        method: "PATCH",
        credentials: "include",
      };
      try {
        await fetch(`http://localhost:3000/user/unfollow/${id}`, settings);
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
          `http://localhost:3000/user/${this.$route.params.id}`
        );
        this.profil = await response.json();
        this.profil.createdAt = new Date(this.profil.createdAt);
      } catch (error) {
        console.log(error);
      }
      try {
        const response = await fetch(
          `http://localhost:3000/post/user/${this.$route.params.id}`
        );
        this.posts = await response.json();
        this.posts = this.posts.posts;
      } catch (error) {
        console.log(error);
      }
      try {
        const response = await fetch(
          `http://localhost:3000/user/follow/${this.$route.params.id}`
        );
        this.followProfil = await response.json();
        this.loaded = true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  data() {
    return {
      popup: false,
      profil: {},
      posts: {},
      follows: {},
      filterUser: {},
      followProfil: {
        userFollower: [],
        userFollowing: [],
      },
      loaded: false,
    };
  },
  async created() {
    this.initData();

    this.$watch(() => this.$route.params, this.initData);
    try {
      const response = await fetch(
        `http://localhost:3000/user/follow/${this.user.id}`
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

.magnifier
  top: 40%
  right: 45%
  transform: translate(-50%, -50%)
  width: 50px
  height: 50px
  box-shadow: 0px 0px 0px 1px #fff
  border-radius: 50%
  position: absolute
  margin: auto
  -webkit-animation: magnify 1s linear infinite alternate
  -moz-animation: magnify 1s linear infinite alternate
  animation: magnify 1s linear infinite alternate

  &:before
    content: "Profil"
    font-size: 16px
    left: 6px
    top: 17px

  &:after
    width: 2px
    height: 25px
    background-color: #fff
    bottom: -15px
    left: 51px
    border-radius: 2px
    -webkit-transform: rotate(-45deg)
    -moz-transform: rotate(-45deg)
    transform: rotate(-45deg)
    position: absolute
    content: ""

  &:after, &:before
    position: absolute

@keyframes magnify
  0%
    transform: scale(1)
  100%
    transform: scale(1.3)

.profilUser
  flex-direction: column
  padding-bottom: 20px
  width: 100%
  background-color: rgb(255, 215, 215)

p
  margin-top: 1px
  font-size: 12px

.pfp
  background-color: rgb(255, 215, 215)
  width: 150px
  height: 150px
  border-radius: 100%
  align-self: center
  margin-top: -50px

.background
  object-fit: cover
  width: 100%
  height: 200px

#idCard
  flex-direction: column
  align-self: center
  background-color: white
  width: 80%
  max-width: 500px
  border-radius: 25px
  padding: 10px

  > div
    align-items: center
    justify-content: center
    margin: 10px
    font-size: 12px

    > .calendar
      font-size: 14px
      margin-right: 5px

.name
  font-size: 25px
  font-weight: bold

.bioUser
  margin: 20px 5px
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
    color: #FD2D01
    font-weight: bold
    font-size: 14px

.profilButton
  position: absolute
  top: 280px
  right: 20px
  width: 70px

.unfollowButton
  border: 1px solid #FD2D01
  background-color: white
  color: #fd2d01
  padding: 8px
  border-radius: 15px
  cursor: pointer
  height: 30px
  width: 80px
  font-weight: bold

.followButton
  border: 1px solid #FD2D01
  background-color: #fd2d01
  color: white
  padding: 8px
  border-radius: 15px
  cursor: pointer
  height: 30px
  width: 80px
  font-weight: bold
</style>
