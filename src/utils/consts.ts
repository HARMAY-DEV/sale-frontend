export enum StorageKey {
  TOKEN = 'HARMAY-TOKEN',
  IS_LOGIN = 'HARMAY-IS-LOGIN',
  SHOP_ID = 'HARMAY-SHOP-ID',
  USER_ID = 'HARMAY-USER-ID',
  CART_ID = 'HARMAY-CART-ID',
}

export enum OrderStatus {
  WAITING, // 待支付
  PAYING, // 支付中
  PAID, // 支付完成 
  PRINT, // 打印小票
}

export enum PaymentMethod {
  B_SCAN_C = 'b_scan_c', // 商家扫客户
  C_SCAN_B = 'c_scan_b', // 客户扫商家
  CARD = 'card', // 刷卡支付
  CASH = 'cash', // 现金支付
}

export enum FlowStatus {
  DEFAULT = 'default',
  PENDING = 'pending',
  SUCCEED = 'succeed',
  FAILED = 'failed,'
}

export enum PayType {
  ALIPAY = 'alipay',
  WECHAT = 'wechat',
  COMBINED = 'combined',
  CASH = 'cash',
  CARD = 'card',
}