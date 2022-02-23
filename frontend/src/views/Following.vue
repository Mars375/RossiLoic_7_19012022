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
          <img :src="follower.picture" class="pp" />
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
        return id === f.personBeingFollowed;
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
    unfollow(id, event) {
      setTimeout(async () => {
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
      }, 500);
      event.target.closest("article").classList.add("unfollowing");
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
      unfollowing: false,
    };
  },
  async created() {
    try {
      const response = await fetch(
        `http://localhost:3000/user/follow/${this.$route.params.id}`
      );
      this.follows = await response.json();
    } catch (error) {
      console.log(error);
    }
    try {
      const response = await fetch(`http://localhost:3000/user`);
      this.users = await response.json();
      this.filterUser = this.users.filter((el) => {
        return this.follows.userFollowing.some((f) => {
          return el.id === f.personBeingFollowed;
        });
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
