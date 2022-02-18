<template>
  <main class="flex">
    <div class="flex profilUser">
      <img :src="profil.background" class="background" />
      <img :src="profil.picture" class="pp" />
      <section id="idCard">
        <h2 class="name">{{ profil.firstname }} {{ profil.lastname }}</h2>
        <p>@{{ profil.username }}</p>
        <div>
          <font-awesome-icon class="icon calendar" icon="calendar-alt" />created
          at {{ profil.createdAt }}
        </div>
        <div class="follow flex">
          <p>{{ profil.following }} following</p>
          <p>{{ profil.followers }} followers</p>
        </div>
        <p class="bioUser">{{ profil.bio }}</p>
      </section>
    </div>
    <div class="posts">
      <div v-for="(post, index) in posts" :key='post.id'>
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
  data() {
    return {
      profil: {},
      posts: {}
    };
  },
  async created() {
    const settings = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        `http://localhost:3000/user/${this.user.id}`,
        settings
      );
      this.profil = await response.json();
    } catch (error) {
      console.log(error);
    }
    try {
      const response = await fetch(
        `http://localhost:3000/post/user/${this.user.id}`,
        settings
      );
      this.posts = await response.json();
      this.posts = this.posts.posts
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
  padding-bottom: 20px
  width: 100%
  background-color: rgb(255, 215, 215)

p
  font-size: 12px

.pp
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
    margin-top: 10px
    width:70%
    justify-content: space-evenly
    font-size: 12px
    display: flex
    align-self: flex-start
    align-items: center

    > .calendar
      font-size: 14px

.name
  font-size: 25px
  font-weight: bold

.bioUser
  margin: 20px
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
</style>
