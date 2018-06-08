<template>
  <v-content class="textual__wrap">
        <v-container grid-list-md text-xs-left>
          <v-layout row wrap>
            <v-flex xs12 sm4>
                <h1 v-if="pageTitle" class="textual__title">{{pageTitle}}</h1>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs11>
                <div v-if="content" v-html="content.Conteudo2"></div>
            </v-flex>
          </v-layout>
        </v-container>
  </v-content>
</template>

<script>
import axios from "axios";

// HELPERS
import {
  accentsTidy,
  activateRoute,
  emitData,
  excerpt,
  excerptWords,
  getPublishingPageImage,
  getRandomNumber,
  handleError,
  helperAxios,
  isPublished,
  leftTrim,
  randomize,
  rightTrim
} from "../helpers/helpers";

export default {
  data() {
    return {
      timer: null,
      content: {},
      pageTitle: ""
    };
  },
  computed: {
    now() {
      return new Date().getFullYear();
    },
    apiUrl() {
      return {
        domain: process.env.API_DOMAIN,
        pageContent: process.env.PAGE_CONTENT,
        pageContentQuery: `(${_spPageContextInfo.pageItemId})${
          process.env.PAGE_CONTENT_QUERY
        }`,
        pageTitle: `(${_spPageContextInfo.pageItemId})${
          process.env.PAGE_TITLE_QUERY
        }`
      };
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getPageContent();
      this.getPageTitle();
    },
    /** Content Pages METHODS **/
    goToPage(path, newWindow = null, origin = window.location.origin) {
      activateRoute(path, newWindow, origin);
    },
    getPageContent() {
      const vm = this;
      helperAxios(
        vm.apiUrl.domain + vm.apiUrl.pageContent + vm.apiUrl.pageContentQuery
      )
        .then(response => (vm.content = response.data.d))
        // .then(data => console.log(data))
        .catch(e => console.error(e));
    },
    getPageTitle() {
      const vm = this;
      helperAxios(
        vm.apiUrl.domain + vm.apiUrl.pageContent + vm.apiUrl.pageTitle
      )
        .then(response => (vm.pageTitle = response.data.d.Title))
        // .then(data => console.log(data))
        .catch(e => console.error(e));
    }
    /** Content Pages METHODS **/
  }
};
</script>
