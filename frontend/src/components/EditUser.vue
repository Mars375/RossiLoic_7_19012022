<template>
  <div class="editContent">
    <v-btn color="button" outlined class="editUser" @click="overlay = !overlay">
      MODIFIER LES INFOS
    </v-btn>
    <v-overlay
      :absolute="absolute"
      :value="overlay"
      :z-index="zIndex"
      @click="overlay = false"
    ></v-overlay>
    <div id="update" v-if="overlay">
      <form method="PUT" action="javascript:void(0)" autocomplete="off">
        <h2 class="flex">
          Modifier les infos
          <font-awesome-icon icon="times" @click="overlay = false" />
        </h2>
        <div class="pfpContent flex">
          <img
            :src="user.picture"
            class="pfp"
            alt="image de profil de l'utilisateur"
            v-if="!selectedFile"
          />
          <img
            :src="imageUrl"
            class="pfp"
            alt="image de profil de l'utilisateur"
            v-if="selectedFile"
          />
          <font-awesome-icon
            icon="times"
            class="icon close"
            @click="removeFile()"
            v-if="selectedFile"
          />
          <input
            id="file"
            class="fileInput"
            type="file"
            accept=".jpg, .jpeg, .png, .gif, .webp"
            @change="onFileSelected"
          />
          <label for="file" class="labelFile">
            <font-awesome-icon class="icon" icon="camera-retro"
          /></label>
        </div>

        <v-card-actions>
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
            <p class="alerte" v-if="regexpfirstname">
              {{ regexpfirstname }}
            </p>
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
        </v-card-actions>
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
        <v-col class="d-flex flex-column align-center">
          <v-btn @click="submit()" color="button" class="submit my-3">Appliquer</v-btn>
          <v-btn @click="deleteUser()" color="button" class="submit">Supprimer</v-btn>
        </v-col>
      </form>
    </div>
  </div>
</template>

<script>
const { isEmail } = require("validator");
const zxcvbn = require("zxcvbn");
import { mapMutations } from "vuex";

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
      selectedFile: null,
      absolute: true,
      overlay: false,
      zIndex: 1,
      user: {},
      show: true,
      warning: true,
      typepassword: "password",
    };
  },
  components: {},
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
    ...mapMutations(["setUser", "setToken"]),
    removeFile() {
      document.getElementById("file").value = null;
      this.selectedFile = null;
    },
    onFileSelected(event) {
      console.log(event.target.files);
      this.selectedFile = event.target.files[0];
      var urlCreator = window.URL || window.webkitURL;
      this.imageUrl = urlCreator.createObjectURL(this.selectedFile);
    },
    async deleteUser() {
      if (confirm("Etes-vous sûr de vouloir supprimer votre profil ?")) {
        const params = {
          method: "DELETE",
          credentials: "include",
        };
        try {
          const response = await fetch(
            `${location.protocol}//${location.hostname}:3000/user/${this.$route.params.id}`,
            params
          );
          await response.json();
          this.setToken(null);
          this.setUser(null);
          await this.$router.push({ name: "Home" });
        } catch (error) {
          error;
        }
      }
    },
    async submit() {
      const infosUser = {
        firstname: this.firstname,
        lastname: this.lastname,
        username: this.username,
        email: this.mail,
        password: this.password,
        bio: this.bio,
      };
      const formData = new FormData();
      formData.append("image", this.selectedFile);
      formData.append("user", JSON.stringify(infosUser));
      const settings = {
        method: "PUT",
        credentials: "include",
        body: formData,
      };
      try {
        const fetchResponse = await fetch(
          `${location.protocol}//${location.hostname}:3000/user/${this.$route.params.id}`,
          settings
        );
        const data = await fetchResponse.json();
        alert(data.message);
        await this.$router.go();
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
        `${location.protocol}//${location.hostname}:3000/user/${this.$route.params.id}`
      );
      this.user = await response.json();
      this.firstname = this.user.firstname;
      this.lastname = this.user.lastname;
      this.username = this.user.username;
      this.mail = this.user.email;
      this.bio = this.user.bio;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="sass" scoped>

.v-card__actions
  justify-content: space-around

.fondBackground
  position: fixed
  background-color: rgba(0, 0, 0, .4)
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 2

.editContent
  display: flex

.editUser
  position: absolute

.pfpContent
  height: 150px
  width: 150px
  margin: 0 auto
  flex-direction: column

  > img
    height: 150px
    width: 150px
    border-radius: 150px

.labelFile
  margin-top: -37px
  margin-left: 113px
  width: 29px
  height: 30px
  background-color: white
  border-radius: 30px
  border: 1px solid var(--lightblack)
  display: flex
  justify-content: center
  align-items: center

.close
  position: absolute
  margin-left: 130px
  top: 55px

.fa-camera-retro
  color: var(--orange)

input[type="file"]
  display: none

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
  color: black

  > svg
    cursor: pointer

#update
  position: fixed
  top: 53%
  left: 50%
  transform: translate(-50%, -50%)
  -webkit-transform-style: preserve-3d
  transform-style: preserve-3d
  z-index: 2
  width: 100%
  height: 94%

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
  overflow: auto

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
  color: #eee
  width: 80%

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

@media screen and (min-width: 615px)

  h2
    margin: 5%

  #update
    height: fit-content
    max-width: 400px

  form
    height: fit-content
    border-radius: 20px
</style>
