var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: ['babel-polyfill', './src/main.js'],
  output: {
    path: path.resolve(__dirname, './ich/SiteAssets'),
    publicPath: '/ich/SiteAssets/',
    // Troque o filename com base no módulo desejado
    filename: 'pesquisa.js'
  },
  module: {
    rules: [{
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(ttf|otf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          outputPath: 'fonts/'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'development') {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: "'development'",
        BASE_PATH: "'/ich'",
        SITE_ASSETS: "'/ich/'",
        API_DOMAIN: "'./src/data'",
        ROOT_API_DOMAIN: "'./src/data'",
        /** HEADER */
        NAV_QUERY: "'/nav.json'",
        SOCIAL_MEDIA: '"/Web/Lists/getByTitle(\'RedesSociais\')/items"',
        SOCIAL_MEDIA_QUERY: "'?$select=Id,Title,Instagram'",
        /** MASTER */
        ARTE_LAZER_CULTURA: "'/arte-lazer-cultura'",
        ARTE_LAZER_CULTURA_QUERY: "'.json'",
        ARTE_LAZER_CULTURA_ITEM: "'.json'",
        ACONTECE: '"/acontece"',
        ACONTECE_QUERY: '".json"',
        /** FOOTER */
        REDES_SOCIAIS: '"/redes"',
        REDES_SOCIAIS_QUERY: '".json"',
        /** HOME */
        BANNERS: "'/banners'",
        BANNERS_QUERY: "'.json'",
        BANNERS_QUERY_ITEM: "'.json'",
        /** INTERNAS */
        PAGE_CONTENT: '"/content"',
        PAGE_CONTENT_QUERY: '".json"',
        /** PAGE CURSOS */
        CURSOS_DOMAIN: '"./src/data"',
        GRADUACAO: '"/cursos-grad"',
        GRADUACAO_QUERY: '".json"',
        POS_GRADUACAO: '"/cursos-pos"',
        POS_GRADUACAO_QUERY: '".json"',
        /** PAGE PESQUISA */
        PESQUISA_DOMAIN: '"./src/data"',
        PESQUISA: '"/pesquisa"',
        PESQUISA_QUERY: '".json"',
      }
    }),
  ])
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        ROOT_API_DOMAIN: "'/_api'",
        BASE_PATH: "'/ich'",
        SITE_ASSETS: "'/ich/SiteAssets/'",
        API_DOMAIN: "'/ich/_api'",
        /** HEADER */
        NAV_QUERY: '"/navigation/menustate?mapprovidername=\'GlobalNavigationSwitchableProvider\'"',
        SOCIAL_MEDIA: '"/Web/Lists/getByTitle(\'RedesSociais\')/items"',
        SOCIAL_MEDIA_QUERY: "'?$select=Id,Title,Instagram'",
        /** MASTER */
        ARTE_LAZER_CULTURA: '"/Web/Lists(\'7A60B8FA-4CED-4B9D-9461-2486B3F264FC\')/items"',
        ARTE_LAZER_CULTURA_QUERY: '"?$filter=Status ne \'Inativo\'&$select=Id,Title,Status,Ordem,ArteLazerLinkDestino,AbrirNovaPagina,FileRef,EncodedAbsUrl,FileDirRef"',
        ARTE_LAZER_CULTURA_ITEM: '"/FieldValuesAsHtml?$filter=Status ne \'Inativo\'&$select=Id,Title,Status,Ordem,ArteLazerLinkDestino,AbrirNovaPagina,FileRef,EncodedAbsUrl,FileDirRef,PublishingPageImage"',
        ACONTECE: '"/Web/Lists/getByTitle(\'Acontece\')/items"',
        ACONTECE_QUERY: '"?$select=Id,Title,Tema,Inscricoes,Ordem&$orderBy=Ordem desc&$top=3"',
        /** FOOTER */
        REDES_SOCIAIS: '"/Web/Lists/getByTitle(\'RedesSociais\')/items"',
        REDES_SOCIAIS_QUERY: '"?$select=Id,Title,AbrirNovaPagina,UrlAbrirNovaJanela,Exibir&$filter=Exibir eq 1"',
        /** HOME */
        BANNERS: '"/Web/Lists(guid\'7A29BC5B-57AC-47BD-8694-2D3B9397B651\')/items"',
        BANNERS_QUERY: '"?select=ID,Title,AbrirNovaPagina,UrlAbrirNovaJanela,DataExpiracao,DataPublicacao,Ordem&$orderBy=Ordem desc"',
        BANNERS_QUERY_ITEM: '"/FieldValuesAsHtml?select=ID,Title,AbrirNovaPagina,UrlAbrirNovaJanela,DataExpiracao,DataPublicacao,Ordem,ImagemPadrao1"',
        PAGE_APRESENTACAO_QUERY: '"/FieldValuesAsText"',
        /** INTERNAS */
        PAGE_CONTENT: '"/Web/Lists/getByTitle(\'Páginas\')/items"',
        PAGE_CONTENT_QUERY: '"/Conteudo2"',
        PAGE_TITLE_QUERY: '"/Title"',
        /** PAGE CURSOS */
        CURSOS_DOMAIN: '"/ich/cursos/_api"',
        GRADUACAO: '"/Web/Lists(guid\'D7AA9AE6-4F58-4482-8B12-12C12D576DBC\')/items"',
        GRADUACAO_QUERY: '"?$select=ID,Curso/Title,Colegiados/Title,Coordenador/Title,Ordem,AbrirNovaPagina,UrlAbrirNovaJanela&$expand=Curso,Colegiados,Coordenador&$orderBy=Ordem desc"',
        POS_GRADUACAO: '"/Web/Lists(guid\'7C969793-AB2C-4B63-BA5F-52FEB1D90672\')/items"',
        POS_GRADUACAO_QUERY: '"?$select=ID,Curso/Title,Colegiado/Title,Coordenador/Title,Ordem,AbrirNovaPagina,UrlAbrirNovaJanela&$expand=Curso,Colegiado,Coordenador&$orderBy=Ordem desc"',
        /** PAGE PESQUISA */
        PESQUISA_DOMAIN: '"/ich/pesquisa/_api"',
        PESQUISA: '"/Web/Lists(guid\'F424A7B9-9B7D-4BDA-A219-3B0757EE3EB3\')/items"',
        PESQUISA_QUERY: '"?$select=ID,Title,Curso/Nome_x0020_do_x0020_curso,Pesquisadores/Nome_x0020_do_x0020_pesquisador,Ano,Ordem&$expand=Curso,Pesquisadores&$orderBy=Ano desc&$orderBy=Ordem desc"',
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
