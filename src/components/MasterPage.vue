<template>
<div class="internas white">
  <div class="container">
    <div class="row internas__content">
      <div class="col-xs-12 col-md-3">
        <h3 class="internas__sidebar-heading">{{headLine}}</h3>
        <ul class="internas__sidebar-list">
          <li class="internas__sidebar-item" v-for="(d, ind) in navigation" :key="ind">
            <a v-if="d.CustomProperties.results[2].Value !== null" target="_blank" :href="d.SimpleUrl" class="internas__sidebar-link">{{d.Title}}</a>
            <a v-if="d.CustomProperties.results[2].Value == null" class="internas__sidebar-link"  :href="'?'+tidy(d.Title)" >{{d.Title}}</a>
            <!-- @click="getPageByName(d.Title)" -->
          </li>
        </ul>
      </div>
      <div class="col-xs-12 col-md-9">
        <!-- #dataContainer -->
        <div class="internas__main">
          <div v-for="item in home" :key="item.Id">
            <div v-html="item.Conteudo2"></div>
          </div>
        </div>
        <!-- *ngIf="gallerySet.length" -->
        <div v-if="gallerySet" class="internas__main">
          <div class="row">
            <div class="col-xs-12">
              <h5 class="internas__galeria-heading">
                Galeria:
              </h5>
            </div>
          </div>
          <div class="internas__galeria-container row">
            <div class="col-xs-12 col-sm-6">
              <div class="row">
                <!-- ngFor="let photo of gallerySet" -->
                <div class="internas__galeria-img col-xs-12 col-sm-4">
                  <img class="img-fluid internas__galeria-img-item" src="photo.Imagem.Url"
                    alt="photo.Imagem.Description">
                    <!-- (click)="changeIMG($event)" (mouseenter)="changeIMG($event)" -->
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6">
              <img class="img-fluid" src="galleryHero" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /.container -->
</div>
</template>

<script>
import axios from 'axios';

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
    // ichPesquisa: Pesquisa
  },
  data() {
    return {
      timer: null,
      aLcContent: [],
      navigation: [],
      paginas: [],
      gallerySet: null,
      headLine: null,
      home: []
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
        navLocal: process.env.NAV_QUERY,
        paginas: process.env.PAGINAS,
        paginasQuery: process.env.PAGINAS_QUERY
      };
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const navigationLocal = this.apiUrl.domain + this.apiUrl.navLocal;
      const pagesAPI =
        this.apiUrl.domain + this.apiUrl.paginas + this.apiUrl.paginasQuery;
      const route = window.location.search;
      this.getNavigation(navigationLocal, this.navigation, 'headLine');
      if (!route) {
        this.getData(
          // API domain
          pagesAPI,
          // Page Set
          this.paginas,
          // Home Page
          this.home,
          // Index
          1
        );
      } else {
        // Gets title from route and clean special chars
        const title = accentsTidy(this.getTitle(route));
        this.getStaticData(pagesAPI)
          .then(response => {
            this.home = response.data.d.results.filter(
              el => accentsTidy(el.Title) === title
            );
            return this.home;
          })
          // .then(data => console.log(data))
          .catch(e => handleError(e));
        //
      }
    },

    /** ARTE / LAZER / CULTURA METHODS **/
    goToPage(path, newWindow = null, origin = window.location.origin) {
      activateRoute(path, newWindow, origin);
    },
    tidy(str) {
      return accentsTidy(str);
    },
    /** Internas METHODS **/
    getPageById(id) {
      console.log(id);
    },
    getPageByName(name) {
      console.log(this.paginas.filter(el => el.Title == name));
      // _spPageContextInfo.pageItemId
    },
    getTitle(name) {
      return name
        .split('/')
        .slice(-1)[0]
        .split('.')
        .slice(0, 1)[0];
    },
    getNavigation(apiUrl, container, headLine) {
      const vm = this;
      helperAxios(apiUrl)
        .then(response => {
          const res = response.data.d.MenuState.Nodes.results;
          vm.headLine = response.data.d.MenuState.StartingNodeTitle;
          res.forEach(el => container.push(el));
          return container;
        })
        // .then(data => console.log(data))
        .catch(e => handleError(e));
    },
    getData(apiUrl, container, home, homeIndex = 0) {
      const vm = this;
      helperAxios(apiUrl)
        .then(response => {
          // console.log(response);
          const res = response.data.d.results;
          res.forEach((el, i) => {
            if (i === homeIndex) {
              home.push(el);
            }
            container.push(el);
          });
          return container;
        })
        // .then(data => console.log(data))
        .catch(e => handleError(e));
    },
    getStaticData(apiUrl) {
      return helperAxios(apiUrl).then(response => {
        return response;
      });
    }
    /** /Internas METHODS **/
  }
};
</script>
