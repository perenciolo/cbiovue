<template>
  <div class="container internas black">
    <div class="row align-items-center justify-content-center">
      <div class="col-xs-12 col-md-4">
        <div class="internas__onca-container d-flex justify-content-center">
          <img class="img-fluid internas__onca" [src]="oncaXS" alt="">
        </div>
      </div>
      <div class="col-xs-12 col-md-8">
        <figure class="internas__title">
          <svg class="internas__title-brasao">
            <use attr.xlink:href="{{brasaoBranco}}"></use>
          </svg>
          <div class="internas__title-text">
            <a href="#" class="internas__title-text--link">
              Curso de
              <br> Ciências Biológicas
            </a>
          </div>
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  components: {
    appDialog: Dialog
  },
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      right: true,
      rightDrawer: false,
      navigation: [],
      basePath: process.env.BASE_PATH,
      header: process.env.SITE_ASSETS + 'img/index.png',
      facebookIcon: process.env.SITE_ASSETS + 'img/facebook.svg',
      instagramIcon: process.env.SITE_ASSETS + 'img/instagram.svg',
      logoBranco: process.env.SITE_ASSETS + 'img/logo__arq--branco.svg',
      brasaoBranco: process.env.SITE_ASSETS + 'img/brasao-branco.svg',
      title: '',
      scrollPosition: false,
      facebookUrl: '#',
      instagramUrl: '#',
      isActive: '',
      busca: '',
      hideSearch: true,
      itensPorPagina: 4,
      pagina: 1,
      posicao: 0,
      pesquisa: null,
      totalRows: 0,
      dialog: false,
      searchBag: []
    };
  },
  computed: {
    apiUrl() {
      return {
        domain: process.env.API_DOMAIN,
        navigationQuery: process.env.NAV_QUERY,
        redes: process.env.SOCIAL_MEDIA,
        redesQuery: process.env.SOCIAL_MEDIA_QUERY
      };
    }
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
    // GET Navigation Items
    this.getNavigation(this.apiUrl.domain + this.apiUrl.navigationQuery);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrollPosition = window.scrollY > 0;
    },
    getNavigation: function(url) {
      // GET request for SharePoint Navigation API
      var vm = this;
      axios({
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json;odata=verbose'
        },
        url: url
      })
        .then(function(response) {
          var nav = response.data.d.MenuState.Nodes.results;
          // Only visible items
          nav = nav.filter(function(element) {
            return element.IsHidden === false;
          });
          nav.forEach(el => {
            vm.navigation.push(el);
          });
          vm.navigationIsSet = true;
          return vm.navigation;
        })
        // .then(data => console.log(data))
        .catch(function(error) {
          console.error(error);
        });
    },
    /**
     * Helper to verify if route is active
     *
     * @param title type string
     * @returns true if title is indexOf window.location.pathname
     *
     */
    active(title) {
      const name = this.accentsTidy(title);
      const location = window.location.pathname;
      const explode = location.split('/');
      var active;
      explode.forEach(el => {
        if (el === name) {
          active = true;
        }
      });
      return active;
    },
    /**
     * Helper to slugfy a string
     *
     * @param str type string
     * @returns slugfyed string
     *
     */
    accentsTidy(str) {
      var r = str.toLowerCase();
      r = r.replace(new RegExp(/\s/g), '');
      r = r.replace(new RegExp(/[àáâãäå]/g), 'a');
      r = r.replace(new RegExp(/æ/g), 'ae');
      r = r.replace(new RegExp(/ç/g), 'c');
      r = r.replace(new RegExp(/[èéêë]/g), 'e');
      r = r.replace(new RegExp(/[ìíîï]/g), 'i');
      r = r.replace(new RegExp(/ñ/g), 'n');
      r = r.replace(new RegExp(/[òóôõö]/g), 'o');
      r = r.replace(new RegExp(/œ/g), 'oe');
      r = r.replace(new RegExp(/[ùúûü]/g), 'u');
      r = r.replace(new RegExp(/[ýÿ]/g), 'y');
      r = r.replace(new RegExp(/\W/g), '');
      return r;
    },
    getSocial() {
      const vm = this;
      vm
        .helperAxios(vm.apiUrl.domain + vm.apiUrl.redes + vm.apiUrl.redesQuery)
        .then(response => {
          const res = response.data.d.results[0];
          vm.facebookUrl = res.Title;
          vm.instagramUrl = res.Instagram;
        });
    },

    getPathName() {
      const origin = window.location.origin;
      const path = window.location.pathname;
      let pathName = '';
      path.split('/').forEach(el => {
        if (
          el !== '' &&
          el !== 'Paginas' &&
          el !== 'Páginas' &&
          el.indexOf('.aspx') === -1
        ) {
          pathName += '/' + el;
        }
      });

      return origin + pathName;
    },

    getPosition(page, limit) {
      let calc = page * limit - limit;
      return calc;
    },

    getQueryString(key) {
      let search = {};
      const regularExpToFindQuery = new RegExp('([^?=&]+)(=([^&]*))?', 'g');
      const buildQueryObj = function($0, $1, $2, $3) {
        search[$1] = $3;
      };
      key.replace(regularExpToFindQuery, buildQueryObj);
      return search;
    },

    getSearchQuery() {
      const query = window.location.search;
      if (query === '' || query === undefined || query === null) {
        return null;
      }
      return this.getQueryString(query)['pesquisa'];
    },

    getCurrentPage() {
      let pagina;
      if (
        window.location.search === '' ||
        !window.location.search.includes('pagina')
      ) {
        pagina = 1;
      } else {
        pagina = this.getQueryString('pagina')['pagina'];
      }
      if (
        pagina === undefined ||
        pagina === null ||
        pagina === '' ||
        pagina === 0 ||
        pagina === '0'
      ) {
        return 1;
      } else {
        return parseInt(pagina);
      }
    },

    getCurrentPosition() {
      if (
        window.location.search === '' ||
        !window.location.search.includes('position') ||
        this.posicao === undefined ||
        this.posicao === null ||
        this.posicao === ''
      ) {
        this.posicao = 0;
      } else {
        this.posicao = parseInt(
          this.getQueryString(window.location.search)['position']
        );
      }
    },

    find(query) {
      let find;
      query === undefined || null ? (find = '') : (find = query);
      window.location.search = `?pesquisa=${find}`;
    },

    closeDialog() {
      this.dialog = false;
      window.location.search = '';
    },

    paginate(e) {
      let page = window.location.search.includes('pagina');
      let position = window.location.search.includes('position');
      let pesquisa;
      this.position = this.getPosition(e, this.itensPorPagina);

      if (page && !position) {
        pesquisa = this.getSearchQuery('pesquisa');
        window.location.search = `?pesquisa=${pesquisa}&pagina=${e}&position=${
          this.position
        }`;
      } else if (page && position) {
        pesquisa = this.getSearchQuery('pesquisa');
        window.location.search = `?pesquisa=${pesquisa}&pagina=${e}&position=${
          this.position
        }`;
      } else {
        window.location.search += `&pagina=${e}&position=${this.position}`;
      }
    },

    // Helper method to get axios promise
    helperAxios: function(
      uri,
      method = 'GET',
      headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json;odata=verbose'
      }
    ) {
      return axios({
        method: method,
        url: uri,
        headers: headers
      });
    },
    goToPage: function(path, newWindow = null) {
      const vm = this;
      // Path is === '/#'? If true keep in the same context
      if (path !== '/#') {
        if (newWindow) {
          // is local
          if (
            !path.split('/')[0] === 'http' ||
            !path.split('/')[0] === 'https'
          ) {
            window.open(window.location.hostname + path, '_blank');
          }
          // is external
          window.open(path, '_blank');
          return;
        }
        window.location.href = path;
      }
    }
  }
};
</script>
