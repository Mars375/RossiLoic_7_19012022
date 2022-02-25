<template>
  <div>
    <div class="fondBackground" @click="editUser = false" v-if="editUser"></div>
    <div id="signup" v-if="editUser">
      <form
        class="signupForm"
        method="PUT"
        action="javascript:void(0)"
        autocomplete="off"
      >
        <h2 class="flex">
          Modifier les infos
          <font-awesome-icon icon="times" />
        </h2>
        <div class="input-container">
          <input
            v-model="firstname"
            type="text"
            id="firstname"
            name="firstname"
            placeholder=" "
            required
          />
          <label for="firstname" :class="{ warning: warning }" class="label"
            >Prénom</label
          >
          <p class="alerte" v-if="regexpfirstname">{{ regexpfirstname }}</p>
        </div>
        <div class="input-container">
          <input
            type="text"
            v-model="lastname"
            id="lastname"
            name="lastname"
            placeholder=" "
            required
          />
          <label for="lastname" :class="{ warning: warning }" class="label"
            >Nom</label
          >
          <p class="alerte" v-if="regexplastname">{{ regexplastname }}</p>
        </div>
        <div class="input-container">
          <input
            type="text"
            v-model="username"
            id="username"
            name="username"
            placeholder=" "
          />
          <label for="username" :class="{ warning: warning }" class="label"
            >Nom d'utilisateur</label
          >
        </div>
        <div class="input-container">
          <input
            type="email"
            v-model="mail"
            id="mail"
            name="mail"
            placeholder=" "
            required
          />
          <label for="mail" :class="{ warning: warning }" class="label"
            >Mail</label
          >
          <p class="alerte" v-if="regexpmail">{{ regexpmail }}</p>
        </div>
        <div class="input-container">
          <input
            :type="typepassword"
            v-model="password"
            id="password"
            name="password"
            placeholder=" "
            required
          />
          <div class="show" @click="showPassword('show')">
            <font-awesome-icon
              class="icon"
              icon="eye"
              v-show="show"
            /><font-awesome-icon class="icon" icon="eye-slash" v-show="!show" />
          </div>
          <label for="password" :class="{ warning: warning }" class="label"
            >Mot de passe</label
          >
        </div>
        <button @click="submit()" class="submit" v-if="!isLoggingIn">
          S'inscrire
        </button>
        <button disabled class="submit" v-if="isLoggingIn">
          <loading-component width="25"></loading-component>
        </button>
        <p>
          Déjà inscrit ?<font-awesome-icon class="icon" icon="arrow-right" /><a
            class="button"
            @click="$emit('change', true)"
            ><span>Se connecter</span></a
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editUser: false,
    };
  },
  methods: {
    isvalid(warning) {
      this.warning = warning;
    },
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
  },
};
</script>

<style lang="sass" scoped>
.fondBackground
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(255, 255, 255, 0.5)

h2
  font-size: 22px
  font-weight: 500
  justify-content: space-between
  margin: 0 43px

  > svg
    cursor: pointer

#signup
  position: fixed
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  -webkit-transform-style: preserve-3d
  transform-style: preserve-3d
  z-index: 1
  width: 95%
  max-width: 400px

form
  user-select: none
  box-shadow: 4px 4px 8px grey
  background-color: white
  border-radius: 25px
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

  > p
    display: flex
    justify-content: center
    align-items: center

    > a > span
      text-decoration: underline
      font-weight: 600

      &:hover
        color: red

  &.rotated
    transform: rotateY(180deg)

  a
    text-decoration: none

input[type="text"], input[type="password"], input[type="email"]
  background-color: #f5f5f5
  border-radius: 12px
  border: 0
  box-sizing: border-box
  color: black
  outline: none
  width: 80%
  padding: 7px

.submit
  background-color: red
  border-radius: 12px
  border: 0
  box-sizing: border-box
  color: #eee
  cursor: pointer
  font-size: 18px
  height: 50px
  width: 80%
  margin: 20px 0

  &:active, &:hover
    filter: brightness(120%)

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

.input-container
  display: flex
  flex-direction: column
  align-items: center
  position: relative
  margin-top: 20px

input:focus ~ .label, input:not(:placeholder-shown) ~ .label
  transform: translateY(-22px) translateX(10px) scale(0.75)
  color: #70d270

input:not(:placeholder-shown) ~ .label.warning
  color: red

.alerte
  color: red
  font-size: 14px

.button
  text-decoration: none
  user-select: none
  cursor: pointer

.icon
  padding: 0 5px
  font-size: 25px

.show
  position: absolute
  top: 5px
  right: 50px
  cursor: pointer
</style>
