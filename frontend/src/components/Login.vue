<template>
  <div id="login" :class="{ rotated: login }">
    <form
      :class="{ rotated: login }"
      class="loginForm"
      method="POST"
      action="javascript:void(0)"
      autocomplete="off"
    >
      <div
        class="alert alert-primary"
        role="alert"
        :style="{ opacity: isLogged ? 1 : 0 }"
      >
        <p class="ok" v-if="isLogged">
          {{ data.message }}
          <loading-component width="25"></loading-component>
        </p>
      </div>
      <div
        class="alert alert-primary"
        role="alert"
        :style="{ opacity: isntLogged ? 1 : 0 }"
      >
        <p class="error" v-if="isntLogged">
          {{ data.message }}
        </p>
      </div>
      <h2 class="flex">
        Connexion
        <font-awesome-icon icon="times" @click="$emit('close', false)" />
      </h2>
      <div class="input-container">
        <input
          type="email"
          v-model="mail"
          id="loginmail"
          name="mail"
          placeholder=" "
          required
        />
        <label for="mail" class="label">Mail</label>
      </div>
      <div class="input-container">
        <input
          :type="typepassword"
          v-model="password"
          id="loginpassword"
          name="password"
          placeholder=" "
          required
          @keydown.enter="submit()"
        />
        <div class="show" @click="showPassword('show')">
          <font-awesome-icon
            class="icon"
            icon="eye"
            v-show="show"
          /><font-awesome-icon class="icon" icon="eye-slash" v-show="!show" />
        </div>
        <label for="password" class="label">Mot de passe</label>
      </div>
      <v-col class="mx-auto my-10 pa-0">
        <v-btn color="button" @click="submit()" class="submit" v-if="!isLoggingIn">Se connecter</v-btn>
      </v-col>
      <button disabled class="submit" v-if="isLoggingIn">
        <loading-component width="25"></loading-component>
      </button>
      <p>
        Besoin d'un compte ?<font-awesome-icon
          class="icon"
          icon="arrow-right"
        /><a id="button" @click="$emit('change', false)"
          ><span>S'inscrire</span></a
        >
      </p>
      {{ error }}
    </form>
  </div>
</template>

<script>
import LoadingComponent from "../components/LoadingComponent.vue";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    LoadingComponent,
  },
  data() {
    return {
      mail: "",
      password: "",

      isLoggingIn: false,
      isntLogged: false,
      isLogged: false,
      typepassword: "password",
      show: true,
      error: "",
      data: {},
    };
  },
  computed: {
    ...mapState({ user: "user" }),
  },
  props: {
    login: Boolean,
  },
  methods: {
    ...mapMutations(["setUser", "setToken"]),
    showPassword(show) {
      if (show === "show") {
        this.show = !this.show;
        if (this.typepassword === "password") {
          this.typepassword = "text";
        } else {
          this.typepassword = "password";
        }
      } else {
        this.showcheck = !this.showcheck;
        if (this.typecheckpassword === "password") {
          this.typecheckpassword = "text";
        } else {
          this.typecheckpassword = "password";
        }
      }
    },
    async submit() {
      this.isLoggingIn = true;
      const settings = {
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.mail,
          password: this.password,
        }),
      };
      try {
        const fetchResponse = await fetch(
          `${location.protocol}//${location.hostname}:3000/auth/login`,
          settings
        );
        if (fetchResponse.ok)
          setTimeout(async () => {
            this.data = await fetchResponse.json();
            this.setUser(this.data.user);
            this.isLoggingIn = false;
            this.isLogged = true;
            setTimeout(() => {
              if (document.cookie)
                this.setToken(
                  document.cookie
                    .split("; ")
                    .find((cookie) => cookie.startsWith("jwt="))
                );
              this.redirect()
            }, 500);
          }, 700);
        else
          setTimeout(async () => {
            const { message } = await fetchResponse.json();
            this.data.message = message;
            this.isLoggingIn = false;
            this.isntLogged = true;
            setTimeout(() => (this.isntLogged = false), 1250);
          }, 700);
      } catch (error) {
        this.error = error;
      }
    },
    redirect() {
      this.$emit("change", false);
      this.isAlertShow = false;
      this.isLogged = false;
      this.$emit("close", false);
    },
  },
};
</script>

<style lang="sass" scoped>

h2
  font-size: 22px
  font-weight: 500
  justify-content: space-between
  margin: 9% 43px

  > svg
    cursor: pointer

#login
  position: fixed
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  -webkit-transform-style: preserve-3d
  transform-style: preserve-3d
  z-index: 0
  width: 100%
  height: 100%

  &.rotated
    z-index: 2

form
  user-select: none
  box-shadow: 4px 4px 8px grey
  background-color: white
  box-sizing: border-box
  padding: 10px 0
  -webkit-transition: all 0.5s ease-in-out
  -moz-transition: all 0.5s ease-in-out
  -o-transition: all 0.5s ease-in-out
  transition: all 0.5s ease-in-out
  -webkit-transform-style: preserve-3d
  transform-style: preserve-3d
  -webkit-backface-visibility: hidden
  -moz-backface-visibility: hidden
  -o-backface-visibility: hidden
  backface-visibility: hidden
  height: 100%

  > p
    display: flex
    justify-content: center
    align-items: center

    > a > span
      text-decoration: underline
      font-weight: 600

      &:hover
        color: red

.loginForm
  transform: rotateY(180deg)

  &.rotated
    transform: rotateY(360deg)

    &:before
      left: 88%

  a
    text-decoration: none

input[type="text"], input[type="password"], input[type="email"]
  background-color: #f5f5f5
  border-radius: 4px
  border: 0
  box-sizing: border-box
  color: black
  outline: none
  width: 80%
  padding: 7px
  height: 40px

.submit
  color: white !important
  cursor: pointer
  width: 80%


.label
  color: #65657b
  font-family: sans-serif
  pointer-events: none
  position: absolute
  align-self: flex-start
  left: 12%
  top: 7px
  transform-origin: 0 50%
  transition: transform 200ms, color 200ms
  top: 8px

.input-container
  display: flex
  flex-direction: column
  align-items: center
  position: relative
  margin-top: 20px
  z-index: 0

  input:focus ~ .label, input:not(:placeholder-shown) ~ .label
    transform: translateY(-26px) translateX(10px) scale(0.75)
    color: #70d270

  p
    color: red

#button
  text-decoration: none
  user-select: none
  cursor: pointer
  background-color: transparent

.icon
  padding: 0 5px
  font-size: 25px

.show
  position: absolute
  top: 8px
  right: 60px
  cursor: pointer

.widget
  margin: 5px
  height: unset

.alert
  height: 40px
  position: absolute
  width: 90%
  color: white
  margin: 0 20px
  opacity: 0

  &>.ok
    display: flex
    align-items: center
    background-color: #70d270
    justify-content: space-around

  &>.error
    display: flex
    align-items: center
    background-color: red
    justify-content: space-around
    height: 30px

@media screen and (min-width: 615px)

  .alert
    top: -50px

  h2
    margin: 5%

  #login
    height: 80%
    max-width: 400px

  form
    height: 60%
    border-radius: 20px

  .submit
    margin: 20px 0
</style>
