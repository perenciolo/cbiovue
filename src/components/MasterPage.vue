<template>

</template>

<script>
import axios from 'axios';

// HELPERS
import {
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
} from '../helpers/helpers';

// Components
// import Home from "./Home.vue";
// import Cursos from "./Cursos.vue";
// import ContentPages from "./ContentPages.vue";

export default {
  components: {
    // ichHome: Home,
    // ichPages: ContentPages,
    // ichCursos: Cursos,
    ichPesquisa: Pesquisa
  },
  data() {
    return {
      timer: null,
      aLcContent: [],
      acontece: []
    };
  },
  computed: {
    now() {
      return new Date().getFullYear();
    },
    apiUrl() {
      return {
        domain: process.env.API_DOMAIN,
        rootDomain: process.env.ROOT_API_DOMAIN,
        arteLazerCultura: process.env.ARTE_LAZER_CULTURA,
        arteLazerCulturaQuery: process.env.ARTE_LAZER_CULTURA_QUERY,
        arteLazerCulturaItem: process.env.ARTE_LAZER_CULTURA_ITEM,
        acontece: process.env.ACONTECE,
        aconteceQuery: process.env.ACONTECE_QUERY
      };
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // GET SharePoint List Arte Lazer Cultura DATA
      this.getArteLazerCultura();
      // GET SharePoint List Acontece DATA
      this.getAcontece();
    },

    /** ARTE / LAZER / CULTURA METHODS **/
    goToPage(path, newWindow = null, origin = window.location.origin) {
      activateRoute(path, newWindow, origin);
    },
    getArteLazerCultura() {
      const vm = this;
      helperAxios(
        vm.apiUrl.rootDomain +
          vm.apiUrl.arteLazerCultura +
          vm.apiUrl.arteLazerCulturaQuery
      )
        .then(response => {
          const res = response.data.d.results;
          res.forEach(el => {
            helperAxios(
              `${vm.apiUrl.rootDomain}${vm.apiUrl.arteLazerCultura}(${el.ID})${
                vm.apiUrl.arteLazerCulturaItem
              }`
            ).then(response => {
              vm.aLcContent.push({
                AbrirNovaPagina: response.data.d.AbrirNovaPagina,
                ArteLazerLinkDestino: response.data.d.ArteLazerLinkDestino,
                FileDirRef: response.data.d.FileDirRef,
                FileRef: response.data.d.FileRef,
                ID: response.data.d.ID,
                Ordem: response.data.d.Ordem,
                PublishingPageImage: getPublishingPageImage(
                  response.data.d.PublishingPageImage
                ),
                Status: response.data.d.Status,
                Title: response.data.d.Title
              });
            });
          });
          return vm.aLcContent;
        })
        // .then(data => console.log(data))
        .catch(e => console.error(e));
    },
    /** /ARTE / LAZER / CULTURA METHODS **/
    /** ACONTECE METHODS **/
    getAcontece() {
      const vm = this;
      helperAxios(
        vm.apiUrl.domain + vm.apiUrl.acontece + vm.apiUrl.aconteceQuery
      )
        .then(response => {
          const res = response.data.d.results;
          res.forEach(el => vm.acontece.push(el));
          return vm.acontece;
        })
        // .then(data => console.log(data))
        .catch(e => handleError(e));
    }
    /** /ACONTECE METHODS **/
  }
};
</script>
