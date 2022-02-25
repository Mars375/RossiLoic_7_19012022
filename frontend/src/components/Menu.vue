<template>
  <div id="menu">
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
      <p @click="$emit('menu', false)" class="directions">
        Connexion / Inscription
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
  methods: {},
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

.border
  border-top: 1px solid lightgrey
  width: 90%
  margin-left: 20px

.menuButton
  text-align: left
  cursor: pointer
  padding: 10px 16px 10px 46px
  user-select: none

  &:hover, &:active
    background-color: var(--salmon)

.directions
  font-size: 14px
  font-weight: 500
  line-height: 18px
  vertical-align: middle
  padding-left: 20px

@media screen and (min-width: 615px)
  
  #menu
    width: 240px
</style>
