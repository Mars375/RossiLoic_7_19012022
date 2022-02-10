<template>
  <header>
    <a aria-label="Accueil" class="home" href="/">
      <div id="logo">
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
      </div>
    </a>
    <form
      action="javascript:void(0)"
      autocomplete="off"
      method="get"
      role="search"
      class="searchbar"
    >
      <label class="headerSearchbar" for="header-searchbar">
        <div>
          <font-awesome-icon class="search" icon="search" />
        </div>
      </label>
      <input type="search" placeholder="Rechercher" />
    </form>
    <div id="nav">
      <a
        class="signup"
        :class="{ active: signup && !login }"
        @click="(signup = !signup) && (login = false)"
        v-if="!logged"
        >S'inscrire</a
      >
      <a
        class="login"
        :class="{ active: signup && login }"
        @click="(login = true) && (signup = true)"
        v-if="!logged"
        >Se connecter</a
      >
      <a
        class="login"
        :class="{ active: signup && login }"
        @click="loggout()"
        v-if="logged"
        >Deconnexion</a
      >
      <a class="menu" @click="ok = !ok" :class="{ active: ok }">
        <font-awesome-icon class="icon" icon="user" />
        <font-awesome-icon class="chevrondown" icon="chevron-down" />
      </a>
    </div>
    <Menu
      @change="signup = $event"
      @menu="ok = $event"
      v-show="ok"
      v-if="!logged"
    />
    <MenuLogged v-show="ok" :data="data" @menu="ok = $event" v-if="logged" />
    <div id="background" @click="signup = !signup" v-show="signup"></div>
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
      @data="data = $event"
    />
  </header>
</template>

<script>
import Signup from "@/components/Signup.vue";
import Login from "@/components/Login.vue";
import Menu from "@/components/Menu.vue";
import MenuLogged from "@/components/MenuLogged.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Signup,
    Login,
    Menu,
    MenuLogged,
  },
  data() {
    return {
      data: {},
      ok: false,
      signup: false,
      login: false,
    };
  },
  methods: {
    ...mapActions(["changelogged"]),
    loggout() {
      this.changelogged(false);
    },
  },
  computed: {
    ...mapState({ logged: "logged" }),
  },
  mounted() {},
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

#logo
  width: 60px

.searchbar
  display: flex
  border-radius: 5px
  border: 1px solid
  height: 40px
  flex-grow: .8
  max-width: 700px

input
  outline: red
  border: none
  width: 100%
  border-radius: 5px

.headerSearchbar
  padding: 0 10px
  display: flex
  align-items: center

.search
  font-size: 20px
  font-weight: 200

.logoDekstop
  display: none

.logoMobile
  align-self: center
  width: 100%
  height: 52px

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
  font-weight: bold
  color: #2c3e50

  &.active
    color: #FD2D01

    & > .chevrondown
      transition-duration: .5s
      transform: rotate(0deg)

.signup, .login
  display: none

.fade-enter-active, .fade-leave-active
  transition: opacity .5s

.fade-enter, .fade-leave-to
  opacity: 0

.chevrondown
  transition-duration: .5s
  transform: rotate(90deg)
  align-self: center

@media screen and (min-width: 615px)

  #nav
    width: 250px
    margin-right: 5px

  .signup
    display: inherit
    border: 1px solid #FD2D01
    color: #fd2d01
    padding: 8px
    border-radius: 15px
    margin-right: 5px
    cursor: pointer

  .login
    display: inherit
    border: 1px solid #FD2D01
    background-color: #fd2d01
    color: white
    padding: 8px
    border-radius: 15px
    margin-right: 5px
    cursor: pointer

  .login, .signup
    &.active, &:hover
      filter: brightness(120%)

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
</style>
