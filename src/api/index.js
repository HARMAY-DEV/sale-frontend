import axios from "axios";
import {Storage} from "../utils/storage";
import {StorageKey} from "../utils/consts";
var url = 'https://sale-dev.api.harmay.com'
const token = Storage.getItem(StorageKey.TOKEN);
export function shopDetail(query) {
    return axios({
        url: 'https://sale-order-dev.api.harmay.com/shop',
        method: 'get',
        params: {},
        headers: {
            'content-type': 'application/json', // 默认值
            'Authorization':'APPCODE f4acfdb82053482fa9b51cf8f901bf7a'
        },
    })
}
export function orderDetail(orderId) {
    return axios({
        url: url+'/order/'+orderId,
        method: 'get',
        params: {},
        headers: {
            'content-type': 'application/json', // 默认值
            'Authorization':token
        },
    })
}
export function orderSync(orderId) {
    return axios({
        url: url+'/order/invoice/'+orderId,
        method: 'get',
        params: {},
        headers: {
            'content-type': 'application/json', // 默认值
            'Authorization':token
        },
    })
}
export function partRefund(data) {
    return axios({
        url: url+'/order/refund',
        method: 'post',
        data,
        headers: {
            'content-type': 'application/json', // 默认值
        },
    })
}

// 新增测试订单
export function addOrder() {
    return axios({
        url: url+'/order',
        method: 'post',
        data: {
            "shop_no": "imperfect-test",
            "goods_list": [{
                "goods_id":"11011200",
                "goods_name":"维生素B5修复喷雾",
                "goods_no":"11011200",
                "num":5,
                "price":200000,
                "spec_id":"11011200",
                "spec_name":"75ml",
                "spec_no":"11011200"
            },{
                "goods_id":"11011201",
                "goods_name":"兰蔻粉水",
                "goods_no":"11011201",
                "num":3,
                "price":18000,
                "spec_id":"11011201",
                "spec_name":"400ml",
                "spec_no":"11011201"
            },{
                "goods_id":"11011432",
                "goods_name":"科颜氏白泥",
                "goods_no":"11011432",
                "num":6,
                "price":43200,
                "spec_id":"11011432",
                "spec_name":"75ml",
                "spec_no":"11011432"
            }]
        },
        headers: {
            'content-type': 'application/json', // 默认值
            'Authorization':token
        },
    })
}
// 获取钉钉用户信息
export function dingDing(code) {
    return axios({
        url:'https://testapi.outiejun.com/api/user/getDingDingUserInfo?tmpAuthCode='+code,
        method: 'get',
        params: {},
        headers: {
            'content-type': 'application/json', // 默认值
            'authorization':token
        },
    })
}
export function dingLogin(data) {
    return axios({
        url: url+'/user/dingding',
        method: 'post',
        data: data,
        headers: {
            'content-type': 'application/json', // 默认值
            'Authorization':'APPCODE f4acfdb82053482fa9b51cf8f901bf7a'
        },
    })
}

// 获取打印机列表
export function printerList(uid) {
    return axios({
        url: '/api/ftl/stamp?uid='+uid,
        method: 'get',
        params: {},
        headers: {
            'content-type': 'application/json', // 默认值
            'authorization':token
        },
    })
}
// 打印机打印
export function setPrint(data) {
    return axios({
        url: '/api/ftl/print',
        method: 'post',
        data: data,
        headers: {
            'content-type': 'multipart/form-data', // 默认值
            'authorization':token
        },
    })
}
// 选择打印机
export function choosePrint(printerName,uid) {
  return axios({
      url: `/api/ftl/jointl?printerName=${printerName}&uid=${uid}`,
      method: 'get',
    
      headers: {
       // 默认值
          'authorization':token
      },
  })
}
// 打印机页面展示
export function pageDisplay(uid) {
  return axios({
      url: `/api/ftl/oldList?uid=`+uid,
      method: 'get',
      headers: {
          'content-type': 'multipart/form-data', // 默认值
          'authorization':token
      },
  })
}