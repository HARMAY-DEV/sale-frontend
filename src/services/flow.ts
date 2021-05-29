import http from './http';
import { FlowStatus, PaymentMethod } from '@/utils/consts';
// import { delay } from '@/utils/delay';
import { fenToYuan, yuanToFen } from '@/utils/money';

interface CreateFlowResponse {
  id: string;
}

interface FlowDetailResponse {
  id: string;
  amount: number;
  paid_amount: number;
  status: string;
}

type FlowListResponse = Array<{
  id: string;
  created_at: string;
  paid_amount: number;
  sub_tender_desc: string;
  status: string;
}>;

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
    return http.post<CreateFlowResponse>('/flow', { tid, pay_mode, amount: yuanToFen(amount), subject });
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
    return http.get<FlowListResponse>(`/flow?tid=${id}`).then((list) => list.map((item) => ({
      id: item.id,
      time: item.created_at.replace('T', ' ').replace(/\..*/, ''),
      amount: fenToYuan(item.paid_amount),
      payType: item.sub_tender_desc === '微信支付' ? '微信' : item.sub_tender_desc,
      status: item.status,
    })));
  }

  /**
   * 获取流水详情
   * @param id 流水ID
   * @returns 
   */
  // getFlowDetail(id: string) {
  //   function fetchData() {
  //     return http.get<FlowDetailResponse>(`/flow/${id}`, {}, false).then((data) => {
  //       if (data.status === 'pay_success') {
  //         return FlowStatus.SUCCEED;
  //       } else if (data.status === 'pay_fail') {
  //         return FlowStatus.FAILED;
  //       } else {
  //         return FlowStatus.PENDING;
  //       }
  //     });
  //   }
    
  //   async function loopFn(resolve: (value: any) => void) {
  //     const status = await fetchData();
  //     if (status !== FlowStatus.PENDING) {
  //       resolve(status);
  //     } else {
  //       await delay(3000);
  //       loopFn(resolve);
  //     }
  //   }
    
  //   return new Promise<FlowStatus>((resolve) => {
  //     loopFn(resolve);
  //   });
  // }

  /**
   * 获取流水详情
   * @param id 流水ID
   * @returns 
   */
  getFlowDetail(id: string) {
    return http.get<FlowDetailResponse>(`/flow/${id}`, {}, false).then((data) => {
      if (data.status === 'pay_success') {
        return FlowStatus.SUCCEED;
      } else if (data.status === 'pay_fail') {
        return FlowStatus.FAILED;
      } else {
        return FlowStatus.PENDING;
      }
    });
  }
}

export default new FlowService();