import { fenToYuan, yuanToFen } from '@/utils/money';
import http from './http';

export interface GoodsInfoResponse {
  goods_id: string;
  goods_name: string;
  goods_no: string;
  price: number;
  spec_id: string;
  spec_name: string;
  spec_no: string;
  name: string;
  img_url: string;
  stock: number;
}

export interface GoodsListResponse {
  shopCartGoods: {
    goods: Array<{
      id: number,
      shop_cart_id: string;
      goods_no: string;
      is_select: boolean;
      img_url: string;
      goods_name: string;
      spec_name: string;
      num: number,
      created_at: string;
      updated_at: string;
    }>;
    shop_cart_id: string;
    total_amount: number;
    total_count: number;
  };
}

function goodsInfoTransformer(data: any) {
  if (!data.goods_id && !data.goods_no) {
    throw new Error('商品信息查询有误！');
  }
  
  return {
    id: data.goods_id || data.goods_no,
    name: data.goods_name,
    price: fenToYuan(data.price || 0),
    stock: data.stock || Infinity, // 库存只做展示用途，默认无限
    picture: data.img_url,
    spec: {
      id: data.spec_id || data.goods_id || data.goods_no,
      name: (data.spec_name || '').replace('规格:', ''),
    },
    quantity: data.num || 0,
  };
}

function cartAction({ shopCartGoods: { goods, shop_cart_id, total_amount, total_count } }: GoodsListResponse) {
  const cartId = shop_cart_id;
  const goodsList = goods.map(goodsInfoTransformer);
  return { cartId, goodsList, totalAmount: fenToYuan(total_amount), totalCount: total_count };
}

class CartService {
  /**
   * 根据购物车ID获取商品列表
   * @param id 购物车id
   * @returns 商品列表
   */
  getShoppingCartGoodsList(id: string) {
    return http.get<GoodsListResponse>(`/shop_cart?shop_cart=${id}`).then(cartAction);
  }
  
  /**
   * 根据商品ID获取商品详情 
   * @param id 商品ID
   * @returns 商品详情
   */
  getGoodsInfo(id: string) {
    return http.get<GoodsInfoResponse>(`/goods/${id}`).then(goodsInfoTransformer);
  }

  /**
   * 向购物车中添加商品
   * @param goodsId 商品ID
   * @param cartId 购物车ID
   * @param price 商品价格
   * @param quantity 添加的数量
   * @returns null
   */
  addGoodsToShoppingCart(goodsId: string, cartId: string, price: number, quantity: number) {
    return http.post<GoodsListResponse>('/shop_cart', {
      goods_no: goodsId,
      shop_cart_id: cartId,
      price: yuanToFen(price),
      num: quantity,
    }).then(cartAction);
  }
  
  /**
   * 从购物车中删除商品
   * @param goodsId 商品ID
   * @param cartId 购物车ID
   * @param quantity 删除的数量
   * @returns null
   */
  removeGoodsFromShoppingCart(goodsId: string, cartId: string, quantity: number) {
    return http.delete<GoodsListResponse>('/shop_cart', {
      goods_no: goodsId,
      shop_cart_id: cartId,
      num: -quantity,
    }).then(cartAction);
  }
}

export default new CartService();