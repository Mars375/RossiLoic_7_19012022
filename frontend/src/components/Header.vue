<template>
  <header>
    <a aria-label="Accueil" class="home" href="/">
      <h1 id="logo">
        <img
          alt="Logo Groupomania"
          src="../assets/icon-left-font.png"
          class="logoDekstop"
        />
        <img
          alt="Logo Groupomania"
          src="../assets/icon.png"
          class="logoMobile"
        />
      </h1>
    </a>
    <v-autocomplete
      v-model="model"
      :items="users"
      :search-input.sync="search"
      :filter="customFilter"
      clearable
      hide-details
      item-value="lastname"
      label="Qui recherchez-vous ?"
      prepend-inner-icon="mdi-magnify"
      dense
      solo
      flat
      outlined
      color="button"
    >
      <template v-slot:item="{ item }">
        <v-list-item @click="redirect(item)"
          >{{ item.firstname }} {{ item.lastname }}</v-list-item
        >
      </template></v-autocomplete
    >
    <div id="nav">
      <v-btn
        small
        outlined
        color="button"
        class="signup mx-1"
        :class="{ active: signup && !login }"
        v-if="!isLoggedIn"
        @click="(signup = !signup) && (login = false)"
        >S'inscrire</v-btn
      >
      <v-btn
        small
        color="button"
        class="login mx-1"
        :class="{ active: signup && login }"
        v-if="!isLoggedIn"
        @click="(login = true) && (signup = true)"
        >Se connecter</v-btn
      >
      <v-btn
        small
        color="button"
        class="mx-1 login"
        :class="{ active: signup && login }"
        v-if="isLoggedIn"
        @click="logout()"
        >Déconnexion</v-btn
      >
      <div class="user mx-2 text-truncate" v-if="user">{{ user.username }}</div>
      <a
        class="menu"
        v-on-clickaway="awayDropdown"
        @click="dropdown = !dropdown"
        :class="{ active: dropdown }"
      >
        <font-awesome-icon class="icon" icon="user" />
        <font-awesome-icon class="chevrondown" icon="chevron-down" />
      </a>
    </div>
    <transition name="dropdown" appear>
      <Menu
        @change="signup = $event"
        @menu="dropdown = $event"
        v-show="dropdown"
        v-if="!isLoggedIn"
      />
    </transition>
    <transition name="dropdown" appear>
      <MenuLogged
        v-show="dropdown"
        :user="user"
        @menu="dropdown = $event"
        v-if="isLoggedIn"
      />
    </transition>
    <div id="background" @click="signup = false" v-show="signup"></div>
    <Signup
      @change="login = $event"
      @close="signup = $event"
      :login="login"
      v-show="signup"
    />
    <Login
      @change="login = $event"
      :login="login"
      v-show="signup"
      @close="signup = $event"
      @user="user = $event"
    />
  </header>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway";
import Signup from "@/components/Signup.vue";
import Login from "@/components/Login.vue";
import Menu from "@/components/Menu.vue";
import MenuLogged from "@/components/MenuLogged.vue";
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
  name: "Header",
  mixins: [clickaway],
  components: {
    Signup,
    Login,
    Menu,
    MenuLogged,
  },
  data() {
    return {
      dropdown: false,
      signup: false,
      login: false,

      users: [],
      model: null,
      search: null,
      tab: null,
    };
  },
  methods: {
    ...mapMutations(["setUser", "setToken"]),

    redirect(user) {
      if (location.pathname == "/profil/" + user.id) return this.$router.go();
      this.$router.push("/profil/" + user.id);
    },
    customFilter(user, queryText) {
      const textOne = user.username.toLowerCase();
      const textTwo = user.lastname.toLowerCase();
      const textThree = user.firstname.toLowerCase();
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1 ||
        textThree.indexOf(searchText) > -1
      );
    },
    awayDropdown() {
      this.dropdown = false;
    },
    awayLog() {
      this.signup = false;
    },
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
        await fetch(
          `${location.protocol}//${location.hostname}:3000/auth/logout`,
          settings
        );
      } catch (error) {
        console.log(error);
      }
      sessionStorage.clear();
      this.setToken(null);
      this.setUser(null);
      await this.$router.go();
    },
  },
  computed: {
    ...mapState({ user: "user" }),
    ...mapGetters(["isLoggedIn"]),
  },
  mounted() {},
  watch: {
    model(val) {
      if (val != null) this.tab = 0;
      else this.tab = null;
    },
    async search() {
      // Items have already been loaded
      if (this.users.length > 0) return;

      // Lazily load input items
      try {
        const fetchResponse = await fetch(
          `${location.protocol}//${location.hostname}:3000/user/`
        );
        if (fetchResponse.ok) this.users = await fetchResponse.json();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="sass" scoped>

#background
  top: 0
  left: 0
  position: fixed
  height: 100%
  width: 100%
  background-color: rgba(0, 0, 0, .4)
  z-index: 0

body
  margin: 0
  background-color: #DAE0E6

header
  color: #2c3e50
  background-color: white
  padding: 20px 0
  display: flex
  justify-content: space-between
  align-items: center
  position: fixed
  top: 0
  left: 0
  right: 0
  height: 52px
  z-index: 2

#logo
  height: 52px
  margin-right: 15px

input
  outline: red
  border: none
  width: 100%
  border-radius: 5px

.headerSearchbar
  padding: 0 10px
  display: flex
  align-items: center

.logoDekstop
  display: none

.logoMobile
  align-self: center
  width: 100%
  height: 52px
  padding: 4px 0 4px 4px

.home
  height: 52px

#nav
  display: flex
  align-items: center
  width: 47px
  justify-content: space-evenly

.menu
  display: flex
  user-select: none
  cursor: pointer

  &.active
    color: var(--orange)

    & > .chevrondown
      transition-duration: .5s
      transform: rotate(0deg)

.signup, .login
  display: none

.chevrondown
  transition-duration: .5s
  transform: rotate(90deg)
  align-self: center

.user
  display: none
  font-weight: bold

@media screen and (min-width: 615px)

  #nav
    width: 300px

  .signup
    display: inherit

  .login
    display: inherit
    color: white !important

  .login, .signup
    &.active, &:hover
      filter: brightness(120%)

  .user
    display: inherit

  .searchbar
    flex-grow: .6

@media screen and (min-width: 615px) and (max-width: 700px)
  .searchbar
    flex-grow: .1

@media screen and (min-width: 1070px)

  #logo
    width: 250px

  .logoMobile
    display: none

  .logoDekstop
    align-self: center
    width: 100%
    height: 52px
    display: inherit

  .user
    display: inherit
</style>
