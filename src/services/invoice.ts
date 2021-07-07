import http from './http';

class InvoiceService {
  /**
   * 获取发票二维码地址
   * @param id 订单ID
   * @returns 
   */
  getInvoiceQRCodeAddress(id: string) {
    return http.get(`/order/invoice/${id}`);
  }

  /**
   * 查询开票结果
   * @param id 发票ID
   * @returns 
   */
  queryInvoiceResult(id: string) {
    return http.get(`/order/invoice/query/${id}`);
  }
} 

export default new InvoiceService();