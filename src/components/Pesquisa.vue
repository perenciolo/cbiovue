<template>
  <v-content class="cursos__wrap">
        <v-container grid-list-md text-xs-left>
          <v-layout row wrap>
            <v-flex xs12 sm4>
              <h1 class="textual__title">Pesquisa</h1>
            </v-flex>
          </v-layout>

          <v-layout row wrap v-for="(item, index) in pesquisa" :key="index" >
            <v-flex xs12>
              <v-container>
                <v-layout row wrap>
                  <v-flex xs12 sm4>
                    <h2 class="textual__subtitle"><i class="material-icons">play_arrow</i> Projetos Aprovados - {{item.key}}</h2>
                  </v-flex>
                </v-layout>
                <span v-if="item.values.length">
                  <v-layout row wrap v-for="(i, index) in item.values" :key="index">
                    <v-flex xs12 sm4 v-if="i.Pesquisadores.results.length">
                      <v-list>
                        <v-list-tile class="pesquisa pesquisa__pesquisador" v-for="(pesquisador,  index) in i.Pesquisadores.results" :key="index">
                          {{pesquisador.Nome_x0020_do_x0020_pesquisador}}
                        </v-list-tile>
                      </v-list>
                    </v-flex>
                    <v-flex xs12 sm4 v-if="i.Curso.results.length">
                      <v-list>
                        <v-list-tile class="pesquisa pesquisa__curso" v-for="(curso,  index) in i.Curso.results" :key="index">
                          {{curso.Nome_x0020_do_x0020_curso}}
                        </v-list-tile>
                      </v-list>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-list>
                        <v-list-tile class="pesquisa pesquisa__resumo">
                          {{i.Title}}
                        </v-list-tile>
                      </v-list>
                    </v-flex>
                  </v-layout>
                </span>
              </v-container>
            </v-flex>
          </v-layout>
        </v-container>
  </v-content>
</template>

<script>
import axios from "axios";

import * as _ from "underscore";

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
      pesquisa: [],
      pesquisaGroupedByAno: []
    };
  },
  computed: {
    now() {
      return new Date().getFullYear();
    },
    apiUrl() {
      return {
        domain: process.env.API_DOMAIN,
        subDomain: process.env.PESQUISA_DOMAIN,
        pesquisa: process.env.PESQUISA,
        pesquisaQuery: process.env.PESQUISA_QUERY
      };
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // Gets Projetos List from SharePoint REST API
      this.getPesquisa(
        this.apiUrl.subDomain +
          this.apiUrl.pesquisa +
          this.apiUrl.pesquisaQuery,
        this.pesquisa,
        { callback: data => data.Ano, grouper: "Ano", method: this.groupBy }
      );
      // Group By this.pesquisa.Ano
      // this.pesquisaGroupedByAno = _.groupBy(this.pesquisa, data => data.Ano);
      console.log(this.pesquisa);
    },
    /** Pesquisa Pages METHODS **/
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
    /** /Pesquisa Pages METHODS **/
    /** Pesquisa GRADUAÇÃO e PÓS-GRADUAÇÃO METHODS **/
    /**
     * @param apiURL - API link to get SharePoint content
     * @param content - container array to push items,
     * @param args? - type (object) *needs key calback and key method to work* This args will change response to something
     * @returns void
     */
    getPesquisa(apiURL, content, args) {
      const vm = this;
      helperAxios(apiURL)
        .then(response => {
          if (args.callback && args.method) {
            args.method(
              response.data.d.results,
              args.callback,
              args.grouper,
              content
            );
            return content;
          } else {
            res = response.data.d.results;
            res.forEach(element => {
              content.push(element);
            });
            return content;
          }
        })
        // .then(data => console.log(data))
        .catch(e => handleError(e));
    },
    /**
     * @param payload - content list
     * @param data - calback function
     * @param key - key value to index
     * @param content - list to push
     * @returns payload grouped by data
     */
    groupBy(payload, data, key, content) {
      const result = _.groupBy(payload, data);
      // map result to a key => value pair and return te overall list
      let index = 0;
      _.mapObject(result, (el, key) => {
        if (parseInt(key) > index) {
          content.unshift({
            key,
            values: el
          });
          index = key;
        } else {
          content.push({
            key,
            values: el
          });
        }
      });
      return _.toArray(content);
    }
    /** /Pesquisa GRADUAÇÃO e POS-GRADUAÇÃO METHODS **/
  }
};
</script>
