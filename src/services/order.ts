import http from './http';

class OrderService {
  /**
   * 创建订单
   * @param shopId 门店ID
   * @param goodsList 商品列表
   * @returns 
   */
  createOrder(shopId: string, goodsList: any[]) {
    return http.post('/order', { shop_no: shopId, goods_list: goodsList });
  }

  /**
   * 创建退款订单（全额退款）
   * @param orderId 订单ID
   * @returns 
   */
  createRefundOrder(orderId: string) {
    return http.post('/order/refund', { refund_mode: 'whole', original_tid: orderId });
  }

  /**
   * 获取订单列表 
   * @returns 
   */
  getOrderList() {
    return http.get('/order')
  }

  /**
   * 获取订单详情
   * @param id 订单ID
   * @returns 
   */
  getOrderDetail(id: string) {
    return http.get(`/order/${id}`);
  }

  /**
   * 检查订单是否支付
   * @param id 订单ID
   * @returns 
   */
  checkOrderIsPay(id: string) {
    return http.get(`/order/check/${id}`);
  }

  /**
   * 同步订单都收钱吧
   * @param id 订单ID
   * @returns 
   */
  syncOrder(id: string) {
    return http.get(`/order/sync/${id}`);
  }
}

export default new OrderService();