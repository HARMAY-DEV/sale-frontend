// module.exports = {
//   productionSourceMap: false,
//   publicPath: './',
// }

module.exports = {
  publicPath: './',
  devServer: {
    open: true, // auto open brower 项目启动后自动打开浏览器...
    disableHostCheck: false,
    // host: "127.0.0.1",
    // port: 8080, // 修改端口号
    https: false,
    hotOnly: false, // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    proxy: {     // string | Object 解决跨域问题
      '/api': {
        target: 'http://172.100.21.44:8703', // 对应自己的 跨域地址 即请求的后端地址
        // target: 'http://172.100.49.208:8703', // 对应自己的 跨域地址 即请求的后端地址
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}