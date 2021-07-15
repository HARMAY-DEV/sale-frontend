import axios from "axios";
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
        url: 'https://sale-dev.api.harmay.com/order/'+orderId,
        method: 'get',
        params: {},
        headers: {
            'content-type': 'application/json', // 默认值
            'Authorization':'APPCODE f4acfdb82053482fa9b51cf8f901bf7a'
        },
    })
}
export function orderSync(orderId) {
    return axios({
        url: 'https://sale-dev.api.harmay.com/order/invoice/858011511841358848',
        method: 'get',
        params: {},
        headers: {
            'content-type': 'application/json', // 默认值
            'Authorization':'APPCODE f4acfdb82053482fa9b51cf8f901bf7a'
        },
    })
}
//部分退款订单
export function partRefund(data) {
    return axios({
        url: ' https://sale-dev.api.harmay.com/order/refund',
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
        url: 'https://sale-dev.api.harmay.com/order',
        method: 'post',
        data: {
            "shop_no": "imperfect-test",
            "goods_list": [{
                "goods_id":"11011200",
                "goods_name":"维生素B5修复喷雾",
                "goods_no":"11011200",
                "num":1,
                "price":200000,
                "spec_id":"11011200",
                "spec_name":"75ml",
                "spec_no":"11011200"
            },{
                "goods_id":"11011201",
                "goods_name":"兰蔻粉水",
                "goods_no":"11011201",
                "num":1,
                "price":18000,
                "spec_id":"11011201",
                "spec_name":"400ml",
                "spec_no":"11011201"
            },{
                "goods_id":"11011432",
                "goods_name":"科颜氏白泥",
                "goods_no":"11011432",
                "num":1,
                "price":43200,
                "spec_id":"11011432",
                "spec_name":"75ml",
                "spec_no":"11011432"
            }]
        },
        headers: {
            'content-type': 'application/json', // 默认值
            'Authorization':'APPCODE f4acfdb82053482fa9b51cf8f901bf7a'
        },
    })
}