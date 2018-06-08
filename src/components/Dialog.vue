<template>
  <v-dialog :value="value" fullscreen transition="dialog-bottom-transition" :overlay="false" scrollable>
    <v-card>
      <v-toolbar card dark color="primary">
        <v-btn icon @click.native="close" dark>
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Resultados da Busca no Site</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text v-if="!content.length">
        <div class="text-xs-center">
          <h2>Não encontramos entradas com os dados inseridos.</h2>
          <v-text-field v-model="busca" solo label="Fazer nova busca" @keyup.enter.stop="find(busca)"></v-text-field>
        </div>
      </v-card-text>
      <v-card-text v-if="content.length">
        <v-layout row wrap>
          <v-flex xs12 sm6 v-for="(item,i) in filterView()" :key="i">
            <v-card class="dialog__search-item dialog__search-card">
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs7>
                    <div>
                      <div class="headline">{{item.Title}}</div>
                      <div><strong>Data de criação:</strong> {{formatDate(item.Created)}}</div>
                    </div>
                  </v-flex>
                  <v-flex xs5>
                    <v-card-media
                      v-if="item.PictureThumbnailURL" 
                      :src="item.PictureThumbnailURL" 
                      height="160px"
                      contain
                    ></v-card-media>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs10>
                    <v-card-actions>
                      <v-btn v-if="item.PictureURL" @click.prevent="go(item.PictureURL)" flat color="orange">Link</v-btn>
                      <v-btn v-if="item.Path && !item.PictureURL" @click.prevent="go(item.Path)" flat color="orange">Caminho</v-btn>
                    </v-card-actions>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
        <div v-if="content.length" class="text-xs-center">
          <ul class="pagination">
            <li v-for="(page,i) in pages" :key="i">
              <button @click.prevent="activate(page)" class="pagination__item" :class="{'pagination__item--active primary': isActive(page)}">{{page}}</button>
            </li>
          </ul>
        </div>
      </v-card-text>
      <div style="flex: 1 1 auto;" />
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      busca: ""
    };
  },
  props: ["content", "value", "pages", "page"],
  created() {},
  methods: {
    close() {
      this.$emit("close");
    },
    formatDate(date) {
      return new Date(date).toLocaleString("pt-BR");
    },
    find(busca) {
      //
      window.location.search = `?pesquisa=${busca}&pagina=${this.page}`;
    },
    go(to) {
      window.location.href = to;
    },
    filterView() {
      let cont = this.content.filter(
        el =>
          el.DocId !== "4408840" &&
          el.DocId !== "4408841" &&
          el.DocId !== "17382" &&
          el.DocId !== "17401" &&
          el.DocId !== "904" &&
          el.DocId !== "906" &&
          el.DocId !== "905" &&
          el.DocId !== "19044" &&
          el.DocId !== "19046" &&
          el.DocId !== "16460" &&
          el.DocId !== "4408800" &&
          el.DocId !== "19091" &&
          el.DocId !== "16183" &&
          el.DocId !== "898" &&
          el.DocId !== "16153" &&
          el.DocId !== "16141" &&
          el.DocId !== "19007" &&
          el.DocId !== "4422237" &&
          el.DocId !== "19025" &&
          el.DocId !== "901" &&
          el.DocId !== "4422233" &&
          el.DocId !== "19057" &&
          el.DocId !== "19072" &&
          el.DocId !== "19054" &&
          el.DocId !== "19065" &&
          el.DocId !== "4422240" &&
          el.DocId !== "16627" &&
          el.DocId !== "18908" &&
          el.DocId !== "16625" &&
          el.DocId !== "4422229" &&
          el.DocId !== "4408832" &&
          el.DocId !== "16085" &&
          el.DocId !== "4408801" &&
          el.DocId !== "16623" &&
          el.DocId !== "17379" &&
          el.DocId !== "4422223"
      );
      return cont;
    },
    getQueryString(key) {
      let search = {};
      const regularExpToFindQuery = new RegExp("([^?=&]+)(=([^&]*))?", "g");
      const buildQueryObj = function($0, $1, $2, $3) {
        search[$1] = $3;
      };
      key.replace(regularExpToFindQuery, buildQueryObj);
      return search;
    },
    isActive(page) {
      if (!window.location.search.includes("pagina")) {
        return page == 1;
      } else {
        return page == this.getQueryString(window.location.search)["pagina"];
      }
    },
    prev() {
      this.$emit("prev");
    },
    activate(page) {
      this.$emit("activate", page);
    },
    next() {
      this.$emit("next");
    }
  }
};
</script>