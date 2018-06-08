<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <!-- style="max-width:874px" -->
      <v-flex d-flex xs12 lg12>
        <v-layout row wrap>
          <v-flex d-flex xs12 sm8 lg5>
              <v-card color="white lighten-2" dark tile flat>
                    <v-card-media
                      v-for="banner in firstBannerToDisplay" :key="banner.ID"
                      :src="banner.PublishingPageImage"
                      transition="fade"
                      width="315px"
                      height="350px"
                      class="is--link animated fade banner"
                      @before-enter="beforeEnter"
                      @enter="enter"
                      @after-enter="afterEnter"
                      @before-leave="beforeLeave"
                      @leave="leave"
                      :class="{'show': highLight(banner.ID)}"
                    >
                    </v-card-media>
              </v-card>
          </v-flex>
          <v-flex d-flex xs12 sm4 lg7>
            <v-layout column justify-center>
              <v-flex
                v-for="(banner,i) in banners"
                :key="i"
                d-flex
                xs12
                style="max-height:87.5px"
              >
                <v-card
                  tile
                  flat
                  :class="{amber: parseInt(banner.ID) === show,'lighten-2': parseInt(banner.ID) === show}"
                >
                  <v-card-text v-on:click="changeBanner(i)">{{banner.Title}}</v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout row wrap mt-5 text-xs-left v-if="apresentacaoContent">
      <v-flex d-flex pr-3 xs12 order-xs1 order-sm1 sm6 class="textual__wrap">
          <v-layout row wrap>
              <v-flex d-flex xs12 sm4>
                <h2 class="textual__title">{{apresentacaoContent.Title}}</h2>
              </v-flex>
          </v-layout>
      </v-flex>
      <v-flex d-flex pr-3 xs12 order-xs4 order-sm2 sm6 class="textual__wrap" v-if="cursos">
          <v-layout row wrap>
              <v-flex d-flex xs12 sm4>
                <h2 class="textual__title">Cursos</h2>
              </v-flex>
          </v-layout>
      </v-flex>
      <v-flex d-flex pr-3 xs12 order-xs2 order-sm3 sm6 class="textual__wrap">
          <div class="textual__content" v-html="apresentacaoContent.Conteudo2"></div>
      </v-flex>
      <v-flex d-flex pr-3 xs12 order-xs5 order-sm4 sm6 class="textual__wrap" v-if="cursos">
          <div class="textual__content" v-html="cursos.Conteudo2"></div>
      </v-flex>
      <v-flex d-flex xs12 order-xs3 order-sm5 sm6 pr-3>
            <v-layout row wrap justify-end>
              <v-flex d-flex xs12 sm3>
                <v-btn color="warning" @click="goToPage(apresentacaoContent.FileRef)">Saiba Mais</v-btn>
              </v-flex>
          </v-layout>
      </v-flex>
      <v-flex d-flex xs12 order-xs6 order-sm6 sm6 pr-3 v-if="cursos">
            <v-layout row wrap justify-end>
              <v-flex d-flex xs12 sm3>
                <v-btn color="warning" @click="goToPage('/ich/cursos/Paginas/default.aspx')">Saiba Mais</v-btn>
              </v-flex>
          </v-layout>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
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
      scrollPosition: false,
      banners: [],
      firstBannerToDisplay: [],
      show: 0,
      bannerIsActive: 0,
      currentNumber: 0,
      timer: null,
      apresentacaoContent: {},
      cursos: {}
    };
  },
  computed: {
    now() {
      return new Date().getFullYear();
    },
    apiUrl() {
      return {
        domain: process.env.API_DOMAIN,
        banners: process.env.BANNERS,
        bannersQuery: process.env.BANNERS_QUERY,
        bannersItem: process.env.BANNERS_QUERY_ITEM,
        pages: process.env.PAGE_CONTENT,
        pageApresentacao: process.env.PAGE_APRESENTACAO_QUERY,
        pageCursos: process.env.PAGE_CONTENT,
        pageCursosQuery: `(${_spPageContextInfo.pageItemId})${
          process.env.PAGE_CONTENT_QUERY
        }`
      };
    }
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
    this.init();
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    init() {
      this.getBanners();
      this.startRotation();
      this.getPageApresentacao();
      this.getPageContent();
    },
    handleScroll() {
      this.scrollPosition = window.scrollY > 0;
    },
    /** Home **/
    goToPage(path, newWindow = null, origin = window.location.origin) {
      activateRoute(path, newWindow, origin);
    },
    getBanners() {
      const vm = this;
      helperAxios(vm.apiUrl.domain + vm.apiUrl.banners + vm.apiUrl.bannersQuery)
        .then(response => {
          const res = response.data.d.results
            .filter(el => isPublished(el.DataPublicacao, el.DataExpiracao))
            .slice(0, 4);
          res.forEach((el, i) => {
            helperAxios(
              `${vm.apiUrl.domain}${vm.apiUrl.banners}(${el.ID})${
                vm.apiUrl.bannersItem
              }`
            ).then(response => {
              const data = response.data.d;
              vm.banners.push(vm.setBannerObj(data));
              if (i === 0) {
                vm.firstBannerToDisplay.push(vm.setBannerObj(data));
              }
            });
          });
          return {
            first: vm.firstBannerToDisplay,
            others: vm.banners
          };
        })
        // .then(data => console.log(data))
        .catch(e => console.error(e));
    },
    /** /BANNERS METHODS **/

    /**
     *  Returns the banner obj
     *  @param results type array - array of results
     *
     */
    setBannerObj(results) {
      return {
        ID: results["ID"],
        Title: results["Title"],
        AbrirNovaPagina: results["AbrirNovaPagina"],
        Ordem: results["Ordem"],
        UrlAbrirNovaJanela: results["UrlAbrirNovaJanela"],
        DataExpiracao: results["DataExpiracao"],
        DataPublicacao: results["DataPublicacao"],
        PublishingPageImage: getPublishingPageImage(results["ImagemPadrao1"])
      };
    },

    /**
     * Highlights current banner
     * @param id
     *
     */
    highLight(id) {
      this.show = parseInt(id);
    },

    /* Sets active banner
      *  @access Public
      *  @returns void
      */
    activateBanner: function() {
      return (this.bannerIsActive = this.choose());
    },

    choose() {
      this.firstBannerToDisplay.pop();
      this.firstBannerToDisplay.push(
        this.banners[Math.abs(this.currentNumber) % this.banners.length]
      );
      return Math.abs(this.currentNumber) % this.banners.length;
    },

    changeBanner(to) {
      this.firstBannerToDisplay.pop();
      this.firstBannerToDisplay.push(this.banners[to]);
      // if (id) {
      //   this.currentNumber = id;
      //   this.highLight(id);
      // }
    },

    /* Starts banner rotation
      *  @access Public
      *  @returns void
      */
    startRotation: function() {
      this.timer = setInterval(this.next.bind(this), 5000);
    },

    /* Stops the banner loop and clear interval
      *  @access Public
      *  @returns void
      */
    stopRotation: function() {
      clearTimeout(this.timer);
      this.timer = null;
    },

    /* Select next banner
      *  @access Public
      *  @returns void
      */
    next: function() {
      this.currentNumber++;
      this.activateBanner();
    },

    /* Select prev banner
      *  @access Public
      *  @returns void
      */
    prev: function() {
      this.currentNumber--;
      this.activateBanner();
    },

    beforeEnter(el, done) {
      el.style.opacity = 0;
      done();
    },

    enter(el, done) {
      el.style.opacity = 0.1;
      done();
    },
    afterEnter(el, done) {
      el.style.opacity = 0.5;
      done();
    },
    beforeLeave(el, done) {
      el.style.opacity = 0.8;
      done();
    },
    leave(el, done) {
      el.style.opacity = 0;
      done();
    },

    /** /BANNERS METHODS **/

    /** Pages METHODS **/
    getPageApresentacao() {
      const vm = this;
      helperAxios(
        `${vm.apiUrl.domain}${vm.apiUrl.pages}(2)${vm.apiUrl.pageApresentacao}`
      )
        .then(response => {
          const res = response.data.d;
          // console.log(res);
          if (accentsTidy(res.Title) === "apresentacao") {
            vm.apresentacaoContent["Title"] = res.Title;
            vm.apresentacaoContent["FileRef"] = res.FileRef;
            vm.apresentacaoContent["Conteudo2"] = excerptWords(
              res.Conteudo2,
              50
            );
          }
          return vm.apresentacaoContent;
        })
        // .then(data => console.log(data))
        .catch(e => handleError(e));
    },
    getPageContent() {
      const vm = this;
      helperAxios(
        vm.apiUrl.domain + vm.apiUrl.pageCursos + vm.apiUrl.pageCursosQuery
      )
        .then(response => (vm.cursos = response.data.d))
        // .then(data => console.log(data))
        .catch(e => console.error(e));
    }
    /** /Pages METHODS **/

    /** /Home METHODS **/
  }
};
</script>
