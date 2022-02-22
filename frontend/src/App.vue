<template>
  <div id="app">
    <Header />
    <transition name="fade" mode="out-in">
    <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  name: "App",
  components: {
    Header,
  },
  data() {
    return {};
  },
};
</script>

<style lang="sass">

.flex
  display: flex

.icon
  font-size: 20px
  vertical-align: middle

  &:active
    color: #FD2D01

button
  text-decoration: none
  user-select: none
  cursor: pointer
  border: none
  background-color: white

a
  color: inherit
  text-decoration: inherit

#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center

  main
    margin-top: 52px

body
  background-color: #DAE0E6

*, *:before, *:after
    box-sizing: border-box

html, body, div, span, object, iframe, figure, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, code, em, img, small, strike, strong, sub, sup, tt, b, u, i, ol, ul, li, fieldset, form, label, table, caption, tbody, tfoot, thead, tr, th, td, main, canvas, embed, footer, header, nav, section, video
    margin: 0
    padding: 0
    border: 0
    font-size: 100%
    font: inherit
    vertical-align: baseline
    text-rendering: optimizeLegibility
    -webkit-font-smoothing: antialiased
    text-size-adjust: none

footer, header, nav, section, main
    display: block

body
    line-height: 1

ol, ul
    list-style: none

blockquote, q
    quotes: none

blockquote:before, blockquote:after, q:before, q:after
    content: ''
    content: none

table
    border-collapse: collapse
    border-spacing: 0

input
    -webkit-appearance: none
    border-radius: 0

.fade-enter-active,
.fade-leave-active
  transition: all .3s ease

.fade-enter,
.fade-leave-active
  opacity: 0
</style>
