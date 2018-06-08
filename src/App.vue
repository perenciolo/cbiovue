<template>
  <v-app>
    <!-- Troque o elemento em main.js e habilite o módulo desejado -->
    <ich-header></ich-header>
    <ich-master></ich-master>
    <ich-footer></ich-footer>
  </v-app>
</template>

<script>
// Global components
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
// Local components
import MasterPage from "./components/MasterPage.vue";

export default {
  name: "header",
  components: {
    ichHeader: Header,
    ichMaster: MasterPage,
    ichFooter: Footer
  },
  data() {
    return {};
  },
  created() {
    // this.$store.dispatch("initStocks");
  }
};
</script>

<style lang="scss">
@import "~vuetify/dist/vuetify.min.css";
@import "~material-design-icons-iconfont/dist/material-design-icons.css";
@import "./scss/main.scss";
</style>
