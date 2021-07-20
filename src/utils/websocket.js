  import store from '../store' // 获取 Vuex Store 实例，注意是**实例**，而不是 vuex 这个库
// websoket地址
let baseurl = 'ws://192.168.31.170:9081/webSocket/user/kkkkkkjjjjjj'

let websocket = null


function setErrorMessage(e) {
  // reconnect()
  console.log('WebSocket连接发生错误   状态码：' + websocket.readyState)
  console.log(e);
}

function setOnopenMessage() {
  // heartCheck.reset().start();      //心跳检测重置
  console.log('链接成功');
  console.log('WebSocket连接成功    状态码：' + websocket.readyState)
}
//没连接上会一直重连，设置延迟避免请求过多
function reconnect() {
  setTimeout(function () {
    websocketLink();
  }, 2000);
}
function setOnmessageMessage(event) {
  // heartCheck.reset().start();      //心跳检测重置
  // 根据服务器推送的消息做自己的业务处理
  // if(event.data==='ping'){
  //   return
  // }
  let data = JSON.parse(event.data)
  // 后台发送的来的消息
  store.commit('SET_USEROBJ', data.data)
  console.log(data);
}

function setOncloseMessage(e) {
  reconnect()
  console.log('WebSocket连接关闭    状态码：' + websocket.readyState, e)
}

function closeWebSocket() {
  websocket.close()
}
export function closeSocket() {
  closeWebSocket()
}

export function websocketLink() {
  websocket = new WebSocket(baseurl)

  /**
   * 建立socket连接，调用时间:
   * 1.首次进入页面，如果不是查看记录，请求出来初始数据后，建立socket连接
   * 2.调用数据库查询完毕后
   * */
  // 连接错误
  websocket.onerror = setErrorMessage

  // 连接成功
  websocket.onopen = setOnopenMessage

  // 收到消息的回调
  websocket.onmessage = setOnmessageMessage

  // 连接关闭的回调
  websocket.onclose = setOncloseMessage

  // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
  window.onbeforeunload = onbeforeunload
}
