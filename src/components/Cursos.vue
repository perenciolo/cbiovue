<template>
  <v-content class="cursos__wrap">
        <v-container grid-list-md text-xs-left>
          <v-layout row wrap>
            <v-flex xs12 sm4>
              <h1 class="textual__title">Cursos</h1>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 sm4>
              <h2 class="textual__subtitle"><i class="material-icons">play_arrow</i> Graduação</h2>
            </v-flex>
          </v-layout>
          <v-layout row wrap >
            <v-flex xs12 sm6 md4 v-for="item in graduacao" :key="item.ID" pl-3 mb-4>
              <v-layout row wrap>
                <v-flex xs12>
                  <h3 class="textual__h3">{{item.Curso.Title}}</h3>
                </v-flex>
                <v-flex xs12>
                  <h4 class="textual__h4">Coordenador</h4>
                  {{item.Coordenador.Title}}
                </v-flex>
              </v-layout>
              <v-layout row wrap v-if="item.Colegiados.results.length">
                <v-flex xs12>
                  <h4 class="textual__h4">Colegiado</h4>
                </v-flex>
                <v-flex xs12 v-for="(colegiado,i) in item.Colegiados.results" :key="i">
                  {{colegiado.Title}}
                </v-flex>
              </v-layout>
              <v-layout row wrap v-if="item.UrlAbrirNovaJanela !== null && item.UrlAbrirNovaJanela !== undefined && item.UrlAbrirNovaJanela !== ''  && item.UrlAbrirNovaJanela !== '/#'  && item.UrlAbrirNovaJanela !== '#'">
                <v-flex xs12>
                  <v-btn color="warning ml-0" @click.prevent="goToPage(item.UrlAbrirNovaJanela, (item.AbrirNovaPagina === 'Não'? null: true) )">Saiba mais</v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 sm4>
              <h2 class="textual__subtitle"><i class="material-icons">play_arrow</i> Pós-graduação</h2>
            </v-flex>
          </v-layout>
          <v-layout row wrap >
            <v-flex xs12 sm6 md4 v-for="item in posGraduacao" :key="item.ID" pl-3 mb-4>
              <v-layout row wrap>
                <v-flex xs12>
                  <h3 class="textual__h3">{{item.Curso.Title}}</h3>
                </v-flex>
                <v-flex xs12>
                  <h4 class="textual__h4">Coordenador</h4>
                  {{item.Coordenador.Title}}
                </v-flex>
              </v-layout>
              <v-layout row wrap v-if="item.Colegiado.results.length">
                <v-flex xs12>
                  <h4 class="textual__h4">Colegiado</h4>
                </v-flex>
                <v-flex xs12 v-for="(colegiado,i) in item.Colegiado.results" :key="i">
                  {{colegiado.Title}}
                </v-flex>
              </v-layout>
              <v-layout row wrap v-if="item.UrlAbrirNovaJanela !== null && item.UrlAbrirNovaJanela !== undefined && item.UrlAbrirNovaJanela !== ''  && item.UrlAbrirNovaJanela !== '/#'  && item.UrlAbrirNovaJanela !== '#'">
                <v-flex xs12>
                  <v-btn color="warning ml-0" @click.prevent="goToPage(item.UrlAbrirNovaJanela, (item.AbrirNovaPagina === 'Não'? null: true) )">Saiba mais</v-btn>
                </v-flex>
              </v-layout>
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
      pageTitle: "",
      graduacao: [],
      posGraduacao: []
    };
  },
  computed: {
    now() {
      return new Date().getFullYear();
    },
    apiUrl() {
      return {
        domain: process.env.API_DOMAIN,
        subDomain: process.env.CURSOS_DOMAIN,
        graduacao: process.env.GRADUACAO,
        graduacaoQuery: process.env.GRADUACAO_QUERY,
        posGraduacao: process.env.POS_GRADUACAO,
        posGraduacaoQuery: process.env.POS_GRADUACAO_QUERY
      };
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // Gets graduação List from SharePoint REST API
      this.getCursos(
        this.apiUrl.subDomain +
          this.apiUrl.graduacao +
          this.apiUrl.graduacaoQuery,
        this.graduacao
      );
      // Gets pós-graduação List from SharePoint REST API
      this.getCursos(
        this.apiUrl.subDomain +
          this.apiUrl.posGraduacao +
          this.apiUrl.posGraduacaoQuery,
        this.posGraduacao
      );
    },
    /** Cursos Pages METHODS **/
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
    },
    /** /Cursos Pages METHODS **/
    /** Cursos GRADUAÇÃO e PÓS-GRADUAÇÃO METHODS **/
    /**
     * @param apiURL - API link to get SharePoint content
     * @param content - container array to push items,
     * @returns void
     */
    getCursos(apiURL, content) {
      const vm = this;
      helperAxios(apiURL)
        .then(response => {
          const res = response.data.d.results;
          res.forEach(element => {
            content.push(element);
          });
          return content;
        })
        .then(data => console.log(data))
        .catch(e => handleError(e));
    }
    /** /Cursos GRADUAÇÃO e POS-GRADUAÇÃO METHODS **/
  }
};
</script>
