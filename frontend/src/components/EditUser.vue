<template>
  <div class="editContent">
    <a class="editUser" @click="editUser = !editUser"> MODIFIER LES INFOS </a>
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
          <font-awesome-icon icon="times" @click="editUser = false" />
        </h2>
        <div class="pfpContent flex">
          <img
            :src="user.picture"
            class="pfp"
            alt="image de profil de l'utilisateur"
          />
          <DropProfilePicture v-if="editUser" class="dropProfilePicture" />
        </div>
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
        <div class="input-container bio">
          <textarea
            type="text"
            v-model="bio"
            id="bio"
            name="bio"
            placeholder=" "
          />
          <label for="bio" :class="{ warning: warning }" class="label"
            >Bio</label
          >
        </div>
        <button @click="submit()" class="submit">Appliquer</button>
        <button @click="deleteUser()" class="remove">Supprimer</button>
      </form>
    </div>
  </div>
</template>

<script>
import DropProfilePicture from "../components/DropProfilePicture.vue";
const { isEmail } = require("validator");
const zxcvbn = require("zxcvbn");

export default {
  data() {
    return {
      bio: "",
      firstname: "",
      lastname: "",
      mail: "",
      password: "",
      checkpassword: "",
      username: "",
      editUser: false,
      user: {},
      show: true,
      warning: true,
      typepassword: "password",
    };
  },
  components: {
    DropProfilePicture,
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
      const passwordSecure = zxcvbn(this.password, [
        this.firstname,
        this.lastname,
        this.mail,
      ]);
      if (!this.password) return "";
      if (
        passwordSecure.score < 2 ||
        this.password.toLowerCase().includes("groupomania")
      ) {
        return "Mot de passe trop faible";
      }
      this.isvalid(false);
      return "";
    },
  },
  methods: {
    async submit() {
      const settings = {
        method: "PUT",
        credentials: "include",
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
          bio: this.bio,
        }),
      };
      try {
        const fetchResponse = await fetch(
          `${process.env.VUE_APP_API_URL}/user/${this.$route.params.id}`,
          settings
        );
          const data = await fetchResponse.json();
          alert(data.message);
          this.$router.go()
      } catch {
        return;
      }
    },
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
  async created() {
    try {
      const response = await fetch(
        `${process.env.VUE_APP_API_URL}/user/${this.$route.params.id}`
      );
      this.user = await response.json();
      this.firstname = this.user.firstname
      this.lastname = this.user.lastname
      this.username = this.user.username
      this.mail = this.user.email
      this.bio = this.user.bio
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="sass" scoped>

.fondBackground
  position: fixed
  background-color: rgba(0, 0, 0, .4)
  top: 0
  left: 0
  width: 100%
  height: 100%

.editContent
  display: flex

.editUser
  background-color: transparent
  position: fixed
  display: flex
  justify-content: center
  padding: 15px
  border: 1px solid var(--lightblack)
  color: var(--orange)
  font-weight: bold

.pfpContent
  height: 150px
  width: 150px
  margin: 0 auto 40px auto
  flex-direction: column

  > img
    height: 150px
    width: 150px
    border-radius: 150px

.dropProfilePicture
  background-color: white
  width: 30px
  min-height: 30px
  border-radius: 30px
  cursor: pointer
  position: relative
  bottom: 30px
  left: 105px
  border: 1px solid var(--lightblack)

h2
  font-size: 22px
  font-weight: 500
  justify-content: space-between
  margin: 20px 43px

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
  user-select: none
  background-color: white
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
  height: 100%
  overflow: scroll

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

input[type="text"], input[type="password"], input[type="email"], textarea
  background-color: #f5f5f5
  border-radius: 4px
  border: 0
  box-sizing: border-box
  color: black
  outline: none
  width: 80%
  padding: 7px
  height: 40px

#bio
  height: 80px
  resize: none

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
  margin-top: 40px
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
  font-size: 14px

.input-container
  display: flex
  flex-direction: column
  align-items: center
  position: relative
  margin-top: 20px

input:focus ~ .label, input:not(:placeholder-shown) ~ .label
  transform: translateY(-26px) translateX(10px) scale(0.75)
  color: #70d270

textarea:focus ~ .label, textarea:not(:placeholder-shown) ~ .label
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
  top: 7px
  right: 60px
  cursor: pointer

.remove
  display: block

@media screen and (min-width: 615px)

  h2
    margin: 5%

  #signup
    height: 80%
    max-width: 400px

  form
    height: fit-content
    border-radius: 20px

  .submit
    margin: 20px 0
</style>
