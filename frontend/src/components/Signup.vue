<template>
  <div id="signup">
    <form
      class="signupForm"
      :class="{ rotated: login }"
      method="POST"
      action="javascript:void(0)"
      autocomplete="off"
    >
      <h2 class="flex">
        S'inscrire
        <font-awesome-icon icon="times" @click="$emit('close', false)" />
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
      <div class="input-container">
        <input
          v-model="checkpassword"
          :type="typecheckpassword"
          id="checkpassword"
          name="checkpassword"
          placeholder=" "
          required
        />
        <div class="show" @click="showPassword('showcheck')">
          <font-awesome-icon
            class="icon"
            icon="eye"
            v-show="showcheck"
          /><font-awesome-icon
            class="icon"
            icon="eye-slash"
            v-show="!showcheck"
          />
        </div>
        <label for="checkpassword" :class="{ warning: warning }" class="label"
          >Confirmer mot de passe</label
        >
        <p class="alerte" v-if="regexppassword">{{ regexppassword }}</p>
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
</template>

<script>
import LoadingComponent from "../components/LoadingComponent.vue";
const { isEmail } = require("validator");
const zxcvbn = require("zxcvbn");

export default {
  components: {
    LoadingComponent,
  },
  data() {
    return {
      firstname: "",
      lastname: "",
      mail: "",
      password: "",
      checkpassword: "",
      username: "",

      isLoggingIn: false,
      isAlertShow: false,
      typepassword: "password",
      typecheckpassword: "password",
      show: true,
      showcheck: true,
      warning: true,
    };
  },
  props: {
    login: Boolean,
  },
  computed: {
    regexpfirstname() {
      if (!this.firstname.match(/^[A-zÀ-ú' -]*$/)) {
        this.isvalid(true);
        return "Veuillez ne saisir que des caractères alphabétiques";
      }
      this.isvalid(false);
      return "";
    },
    regexplastname() {
      if (!this.lastname.match(/^[A-zÀ-ú' -]*$/)) {
        this.isvalid(true);
        return "Veuillez ne saisir que des caractères alphabétiques";
      }
      this.isvalid(false);
      return "";
    },
    regexpmail() {
      if (!this.mail) return "";
      if (!isEmail(this.mail)) {
        this.isvalid(true);
        return "Veuillez respecter le format email : johnDoe@gmail.com";
      }
      this.isvalid(false);
      return "";
    },
    regexppassword() {
      const passwordSecure = zxcvbn(this.password, [this.firstname, this.lastname, this.mail]);
      if (!this.password)
        return ""
      if (passwordSecure.score < 2 || this.password.toLowerCase().includes('groupomania'))
      {
        return "Mot de passe trop faible"
      }
      if (this.password !== this.checkpassword) {
        this.isvalid(true);
        return "Mot de passe différent";
      }
      this.isvalid(false);
      return "";
    },
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
    async submit() {
      if (this.password !== this.checkpassword) {
        return (this.checkpasswordError = "Mot de passe différent");
      }
      this.isLoggingIn = true;
      const settings = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: this.firstname,
          lastname: this.lastname,
          username: this.username,
          email: this.mail,
          password: this.password,
        }),
      };
      try {
        const fetchResponse = await fetch(
          `${location.protocol}//${location.hostname}:3000/auth/signup`,
          settings
        );
        setTimeout(async () => {
          const data = await fetchResponse.json();
          alert(data.message)
          this.isLoggingIn = false;
          setTimeout(() => this.redirect(), 500);
        }, 500);
      } catch {
        return;
      }
    },
    redirect() {
      return;
    },
  },
};
</script>

<style lang="sass" scoped>

h2
  font-size: 22px
  font-weight: 500
  justify-content: space-between
  margin: 10% 43px

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
  width: 100%
  height: 100%

form
  background-color: white
  user-select: none
  box-sizing: border-box
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
  overflow: scroll
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

  &.rotated
    transform: rotateY(180deg)

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
  background-color: red
  border-radius: 12px
  border: 0
  box-sizing: border-box
  color: #eee
  cursor: pointer
  font-size: 18px
  height: 50px
  width: 80%
  margin: 40px 0
  align-self: center

  &:active, &:hover
    filter: brightness(120%)

.label
  color: #65657b
  font-family: sans-serif
  pointer-events: none
  position: absolute
  align-self: flex-start
  left: 12%
  transform-origin: 0 50%
  transition: transform 200ms, color 200ms
  top: 13px

.input-container
  display: flex
  flex-direction: column
  align-items: center
  position: relative
  margin-top: 20px

input:focus ~ .label, input:not(:placeholder-shown) ~ .label
  transform: translateY(-26px) translateX(10px) scale(0.75)
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

@media screen and (min-width: 615px)

  h2
    margin: 5%

  #signup
    height: 80%
    max-width: 400px

  form
    height: 80%
    border-radius: 20px

  .submit
    margin: 20px 0
</style>
