<template>
  <v-footer height="auto">
    <v-card
      flat
      tile
      class="primary white--text text-xs-center"
    >
      <v-card-text>
        <span  v-for="icon in socialMedia" :key="icon.ID">
          <v-btn
            v-if="icon.Exibir === true"
            icon
            class="mx-3 white--text"
            @click.prevent="goToPage(icon.UrlAbrirNovaJanela, icon.AbrirNovaPagina === 'Sim'? true: null)"
          >
            <v-icon size="24px">{{ icon.icon }}</v-icon>
          </v-btn>
        </span>
      </v-card-text>
      <v-card-text class="white--text pt-0 text-xs-center" style="width:100vw">
        Avenida Dom José Gaspar, 500
        Coração Eucarístico
        Belo Horizonte - Minas Gerais
        (31) 3319-4444
      </v-card-text>
      <v-card-text class="white--text">
        &copy; {{now}} — <strong>PUC Minas</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
// HELPERS
import {
  accentsTidy,
  activateRoute,
  handleError,
  helperAxios
} from "../helpers/helpers";
export default {
  data() {
    return {
      scrollPosition: false,
      icons: [
        "fa fa-facebook-square",
        "fa fa-instagram",
        "fa fa-twitter-square",
        "fa fa-google-plus-square",
        "fa fa-linkedin-square"
      ],
      socialMedia: []
    };
  },
  computed: {
    now() {
      return new Date().getFullYear();
    },
    apiUrl() {
      return {
        domain: process.env.API_DOMAIN,
        socialMedia: process.env.REDES_SOCIAIS,
        socialMediaQuery: process.env.REDES_SOCIAIS_QUERY
      };
    }
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
    this.getSocialMedia();
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrollPosition = window.scrollY > 0;
    },
    goToPage(path, newWindow = null, origin = window.location.origin) {
      console.log(path);
      console.log(newWindow);
      activateRoute(path, newWindow, origin);
    },
    getSocialMedia() {
      const vm = this;
      helperAxios(
        vm.apiUrl.domain + vm.apiUrl.socialMedia + vm.apiUrl.socialMediaQuery
      )
        .then(response => {
          const icons = {
            facebook: "fa fa-facebook-square",
            instagram: "fa fa-instagram",
            twitter: "fa fa-twitter-square",
            googleplus: "fa fa-google-plus-square",
            linkedin: "fa fa-linkedin-square"
          };
          response.data.d.results.forEach(element => {
            if (accentsTidy(element["Title"]) === "facebook") {
              element = {
                ...element,
                icon: icons.facebook
              };
              vm.socialMedia.push(element);
            }
            if (accentsTidy(element["Title"]) === "instagram") {
              element = {
                ...element,
                icon: icons.instagram
              };
              vm.socialMedia.push(element);
            }
            if (accentsTidy(element["Title"]) === "twitter") {
              element = {
                ...element,
                icon: icons.twitter
              };
              vm.socialMedia.push(element);
            }
            if (accentsTidy(element["Title"]) === "googleplus") {
              element = {
                ...element,
                icon: icons.googleplus
              };
              vm.socialMedia.push(element);
            }
            if (accentsTidy(element["Title"]) === "linkedin") {
              element = {
                ...element,
                icon: icons.linkedin
              };
              vm.socialMedia.push(element);
            }
          });
          return vm.socialMedia;
        })
        // .then(data => console.log(data))
        .catch(e => handleError(e));
    }
  }
};
</script>
