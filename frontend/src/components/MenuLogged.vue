<template>
  <div id="menu">
    <div class="user" v-if="user.username">{{ user.username }}</div>
    <div class="menuButton flex">
      <font-awesome-icon class="icon" icon="moon" />
      <p class="directions">Thème sombre</p>
      <!-- <button class="checkbox">
        <div class="check"></div>
      </button> -->
    </div>
    <router-link
      :to="{ name: 'Profil', params: { id: user.id } }"
      @click.native="$emit('menu', false)"
      class="menuButton flex"
    >
      <font-awesome-icon class="icon" icon="id-card" />
      <p class="directions">Profil</p>
    </router-link>
    <div class="border flex"></div>
    <div @click="$emit('change', true) && logout()" class="menuButton flex">
      <font-awesome-icon class="icon" icon="sign-in-alt" />
      <p class="directions">Deconnexion</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({ user: "user" }),
  },
  components: {},
  methods: {
    ...mapMutations(["setUser", "setToken"]),
    async logout() {
      const settings = {
        credentials: "include",
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      try {
        await fetch(`${location.protocol}//${location.hostname}:3000/auth/logout`, settings);
      } catch (error) {
        console.log(error);
      }
      this.$emit("menu", false);
      sessionStorage.clear();
      this.setToken(null);
      this.setUser(null);
      await this.$router.go();
    },
  },
};
</script>

<style lang="sass" scoped>

ul
  list-style: none
  padding: 0
  margin: 0

#menu
  width: 100%
  background-color: white
  position: fixed
  top: 52px
  right: 0
  z-index: 9999

.border
  border-top: 1px solid lightgrey
  width: 90%
  margin-left: 20px

.menuButton
  text-align: left
  cursor: pointer
  padding: 10px 16px 10px 46px

  &:hover
    background-color: var(--salmon)

.directions
  font-size: 14px
  font-weight: 500
  line-height: 18px
  vertical-align: middle
  padding-left: 20px

.user
  margin: 10px 0
  font-weight: bold

@media screen and (min-width: 615px)

  .user
    display: none
  
  #menu
    width: 240px

@media screen and (min-width: 1070px)

  .user
    display: none
</style>
