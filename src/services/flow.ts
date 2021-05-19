import http from './http';

class FlowService {
  /**
   * 创建支付流水
   * @param tid 订单ID  
   * @param payMode 支付方式
   * @param amount 数量
   * @param subject 
   * @returns 
   */
  createFlow(tid: string, payMode: string, amount: number, subject: string) {
    return http.post('/flow', {});
  }

  /**
   * 根据订单ID获取流水列表
   * @param id 订单ID
   * @returns 
   */
  getFlowListByOrderId(id: string) {
    return http.get(`/flow?tid=${id}`);
  }

  /**
   * 获取流水详情
   * @param id 流水ID
   * @returns 
   */
  getFlowDetail(id: string) {
    return http.get(`/flow/${id}`);
  }
}

export default new FlowService();