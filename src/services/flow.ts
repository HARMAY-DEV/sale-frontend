import http from './http';
import { PaymentMethod } from '@/utils/consts';

interface CreateFlowResponse {
  id: string;
}

class FlowService {
  /**
   * 创建支付流水
   * @param tid 订单ID  
   * @param payMode 支付方式
   * @param amount 金额 单位为分
   * @param subject? 可不填
   * @returns 流水ID
   */
  createFlow(tid: string, pay_mode: PaymentMethod, amount: number, subject?: string) {
    return http.post<CreateFlowResponse>('/flow', { tid, pay_mode, amount, subject });
  }

  /**
   * 支付流水
   * @param flowId 创建流水后返回的流水ID
   * @param dynamic_id 扫码枪输出的ID
   * @returns 
   */
  payFlow(flowId: string, dynamic_id: string) {
    return http.post(`/flow/pay/${flowId}`, { dynamic_id });
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