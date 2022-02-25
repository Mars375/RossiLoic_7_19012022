<template>
  <main class="home">
    <div class="flex">
      <router-link
        :to="{ name: 'Profil', params: { id: $route.params.id } }"
        class="back"
        ><font-awesome-icon class="icon" icon="arrow-left"
      /></router-link>
      <div>
        <h2 v-if="profil">{{ profil.firstname }} {{ profil.lastname }}</h2>
        <p v-if="profil">@{{ profil.username }}</p>
      </div>
    </div>
    <nav class="flex">
      <router-link :to="{ name: 'Follower' }" class="follower">
        <h2 class="title">Follower</h2>
      </router-link>
      <router-link :to="{ name: 'Following' }" class="following">
        <h2 class="title">Following</h2>
      </router-link>
    </nav>
    <section class="followList">
      <article v-for="follower in filterUser" :key="follower.id" class="flex">
        <router-link
          :to="{ name: 'Profil', params: { id: follower.id } }"
          class="flex"
        >
          <img :src="follower.picture" class="pp" alt="image de profil de la personne qui vous suit"/>
          <div>
            <h2 class="name">
              {{ follower.firstname }} {{ follower.lastname }}
            </h2>
            <p>@{{ follower.username }}</p>
          </div>
        </router-link>
        <button
          v-if="isFollow(follower.id) && isNotHimself(follower.id)"
          @click="unfollow(follower.id, $event)"
          class="unfollowButton"
        >
          Unfollow
        </button>
        <button
          v-else-if="isNotHimself(follower.id)"
          @click="follow(follower.id)"
          class="followButton"
        >
          Follow
        </button>
      </article>
    </section>
  </main>
</template>

<script>
import { mapState } from "vuex";
// @ is an alias to /src

export default {
  name: "Home",
  components: {
    // HelloWorld
  },
  computed: {
    ...mapState({ user: "user" }),
    profil() {
      if (!this.users.length) return;
      const user = this.users.find((user) => user.id == this.$route.params.id);
      return {
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
      };
    },
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
        await fetch(`${process.env.VUE_APP_API_URL}/user/follow/${id}`, settings);
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
        await fetch(`${process.env.VUE_APP_API_URL}/user/unfollow/${id}`, settings);
        this.follows.userFollowing.splice(
          this.follows.userFollowing.indexOf(event),
          1
        );
      } catch (error) {
        console.log(error);
      }
    },
  },
  data() {
    return {
      users: {},
      follows: {
        userFollower: [],
        userFollowing: [],
      },
      filterUser: {},
      isFollowing: {},
      animToUse: true,
    };
  },
  async created() {
    try {
      const response = await fetch(
        `${process.env.VUE_APP_API_URL}/user/follow/${this.$route.params.id}`
      );
      this.follows = await response.json();
    } catch (error) {
      console.log(error);
    }
    try {
      const response = await fetch(`${process.env.VUE_APP_API_URL}/user`);
      this.users = await response.json();
      this.filterUser = this.users.filter((el) => {
        return this.follows.userFollower.some((f) => {
          return el.id === f.personFollowing;
        });
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="sass" scoped>
.home > div
  padding: 10px
  align-items: center
  > div
    margin-left: 60px
    >h2
      font-weight: bold
    >p
      font-size: 14px

nav
  border-bottom: 1px solid lightgreya

  .router-link-exact-active .title
    background-color: var(--salmon)

.following, .follower
  width: 50%

.title
  padding: 20px
  background-color: white
  font-weight: bold
  border-radius: 20px 20px 0 0
  margin-right: 10px
  width: 100%
  border-bottom: 1px solid var(--salmon)

  &:hover
    background-color: var(--salmon)

.followList
  overflow: hidden
  min-height: 81vh
  background-color: white
  row-gap: 20px
  justify-content: space-between
  flex-wrap: wrap
  align-content: flex-start
  padding: 20px

  > article
    height: 100%
    justify-content: space-between
    align-items: center

    > a
      align-content: flex-start
      max-width: fit-content

      > img
        width: 75px
        height: 75px

      > div
        margin-left: 10px

        > h2
          margin-top: 23px
          font-weight: bold

        > p
          font-size: 12px
          text-align: start
          color: grey

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

.unfollowing
  transition-duration : 500ms
  margin-top: -75px
  opacity: 0
</style>
