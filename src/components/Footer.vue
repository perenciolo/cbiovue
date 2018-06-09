<template>
  <footer id="footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xs-12 col-sm-6">
          <div class="box">
            <h3>Fale conosco</h3>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6" id="white">
          <div class="box">
            <div class="info">
              <p>
                Av. Dom José Gaspar, 500 - Coração Eucarístico - Belo Horizonte - MG
              </p>
              <p>
                <span>CEP:</span> 30535-901
              </p>
              <p>
                <span>Telefone:</span> (31) 3319-4157
              </p>
              <p>
                <span>Email:</span>
                <a href="mailto:ciencias@pucminas.br">ciencias@pucminas.br</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
// HELPERS
import {
  accentsTidy,
  activateRoute,
  handleError,
  helperAxios
} from '../helpers/helpers';
export default {
  data() {
    return {
      scrollPosition: false,
      icons: [
        'fa fa-facebook-square',
        'fa fa-instagram',
        'fa fa-twitter-square',
        'fa fa-google-plus-square',
        'fa fa-linkedin-square'
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
    window.addEventListener('scroll', this.handleScroll);
    // this.getSocialMedia();
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
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
            facebook: 'fa fa-facebook-square',
            instagram: 'fa fa-instagram',
            twitter: 'fa fa-twitter-square',
            googleplus: 'fa fa-google-plus-square',
            linkedin: 'fa fa-linkedin-square'
          };
          response.data.d.results.forEach(element => {
            if (accentsTidy(element['Title']) === 'facebook') {
              element = {
                ...element,
                icon: icons.facebook
              };
              vm.socialMedia.push(element);
            }
            if (accentsTidy(element['Title']) === 'instagram') {
              element = {
                ...element,
                icon: icons.instagram
              };
              vm.socialMedia.push(element);
            }
            if (accentsTidy(element['Title']) === 'twitter') {
              element = {
                ...element,
                icon: icons.twitter
              };
              vm.socialMedia.push(element);
            }
            if (accentsTidy(element['Title']) === 'googleplus') {
              element = {
                ...element,
                icon: icons.googleplus
              };
              vm.socialMedia.push(element);
            }
            if (accentsTidy(element['Title']) === 'linkedin') {
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
