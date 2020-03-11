module.exports ={
  publicPath:'/',
  configureWebpack:{
    resolve:{
      alias:{
        'assets' :'@/assets',
        'common' :'@/common',
        'components' :'@/components',
        'network' :'@/network',
        'views' :'@/views'
      }
    }
  },
  devServer:{
    proxy: {
      '/api':{
        //ws:表示WebSocket协议；changeOrigin:true;表示是否改变原域名；
        target:'http://localhost:8443',
        changeOrigin:true,
        ws:true,
        pathRewrite:{
          '^/api':'/api'
        }
      }
    }
  }
}