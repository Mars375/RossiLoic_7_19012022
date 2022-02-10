<template>
  <div id="menu">
    <div class="user">{{ data.username }}</div>
    <div class="menuButton flex">
      <font-awesome-icon class="icon" icon="moon" />
      <p class="directions">Thème sombre</p>
      <!-- <button class="checkbox">
        <div class="check"></div>
      </button> -->
    </div>
    <div class="border flex"></div>
    <div @click="$emit('change', true)" class="menuButton flex">
      <font-awesome-icon class="icon" icon="sign-in-alt" />
      <p @click="loggout()" class="directions">Deconnexion</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
    };
  },
  props: {
    data: Object
  },
  computed: {
    ...mapState({ logged: "logged" }),
  },
  components: {},
  methods: {
    ...mapActions(["changelogged"]),
    loggout() {
      this.$emit('menu', false)
      this.changelogged(false);
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
  width: 230px
  background-color: white
  position: fixed
  top: 45px
  right: 0

.border
  border-top: 1px solid lightgrey
  width: 90%
  margin-left: 20px

.menuButton
  text-align: left
  cursor: pointer
  padding: 10px 16px 10px 46px

  &:hover
    background-color: rgb(255, 215, 215)

.directions
  font-size: 14px
  font-weight: 500
  line-height: 18px
  vertical-align: middle
  padding-left: 20px
</style>
