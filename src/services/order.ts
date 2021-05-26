import { fenToYuan, stringToNumber } from '@/utils/money';
import http from './http';

interface CreateOrderResponse {
  tid: string;
  created_at: string;
  paid: string;
  pay_type: string;
  pay_status: string;
  pay_time: string;
  refund_amount: string;
  status: string;
}

interface OrderListResponse {
  count: number;
  order: Array<{
    created_at: string;
    paid: string;
    pay_type: string;
    pay_status: string;
    tid: string;
  }>;
}

interface OrderResponse {
  tid: string;
  status: string;
  goods_list: Array<{
    goods_id: string;
    goods_name: string;
    num: number;
    price: number;
    spec_name: string;
  }>;
  pay_type: string;
  pay_status: string;
  created_at: string;
  paid: string;
  payable_amount: string;
}

function getOrderStatus(status: string): { label: string, value: string } {
  switch (status) {
    case 'unpaid':
      return { label: '未付款', value: 'unpaid' };
    
    case 'wait_pay':
      return { label: '未付款', value: 'waitPay' };

    case 'partial_pay':
      return { label: '部分付款', value: 'partialPay' };
    
    case 'refund_success':
      return { label: '退款成功', value: 'refundSuccess' };

    case 'partial_refund':
      return { label: '部分退款', value: 'partialRefund' };

    case 'pay_success':
      return { label: '支付成功', value: 'paySuccess' };

    case 'pay_fail':
      return { label: '支付成功', value: 'payFail' };
    
    default:
      return { label: '未知状态', value: 'unknownStatus' };
  }
}

class OrderService {
  /**
   * 创建订单
   * @param shopId 门店ID
   * @param goodsList 商品列表
   * @returns 
   */
  createOrder(shopId: string, goodsList: any[]) {
    return http.post<CreateOrderResponse>('/order', { shop_no: shopId, goods_list: goodsList })
      .then(data => data.tid);
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
    return http.get<OrderListResponse>('/order', {}, false).then(({ order }) => {
      return order.map(item => ({
        id: item.tid,
        time: item.created_at,
        paidAmount: fenToYuan(item.paid),
        paymentMethod: item.pay_type || '未支付',
        status: getOrderStatus(item.pay_status),
      }));
    });
  }

  /**
   * 获取订单详情
   * @param id 订单ID
   * @returns 
   */
  getOrderDetail(id: string) {
    return http.get<OrderResponse>(`/order/${id}`).then((data) => {
      return {
        orderInfo: {
          id: data.tid,
          status: data.status,
          payStatus: data.pay_status,
          payType: data.pay_type,
          time: data.created_at.replace('T', ' ').replace(/\..*/, ''),
          payableAmount: stringToNumber(data.payable_amount),
          paidAmount: fenToYuan(data.paid),
        },
        goodsList: data.goods_list.map((goods) => ({
          id: goods.goods_id,
          name: goods.goods_name,
          spec: goods.spec_name,
          price: goods.price,
          quantity: goods.num,
          amount: goods.num * goods.price,
        })),
      };
    });
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