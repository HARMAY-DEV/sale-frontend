import http from './http';

export interface GoodsInfo {
  goods_id: string;
  goods_name: string;
  goods_no: string;
  price: string;
  spec_id: string;
  spec_name: string;
  spec_no: string;
  name: string;
  img_url: string;
  stock: number;
}

export interface GoodsList {
  shopCartGoods: Array<{
    id: number,
    shop_cart_id: string;
    goods_no: string;
    is_select: boolean;
    img_url: string;
    goods_name: string;
    spec_name: string;
    num: 3,
    created_at: string;
    updated_at: string;
  }>;
}

class CartService {
  /**
   * 根据购物车ID获取商品列表
   * @param id 购物车id
   * @returns 商品列表
   */
  getShoppingCartGoodsList(id: string): Promise<GoodsList['shopCartGoods']> {
    return http.get<GoodsList>(`/shop_cart?shop_cart=${id}`).then(({ shopCartGoods }) => shopCartGoods);
  }
  
  /**
   * 根据商品ID获取商品详情 
   * @param id 商品ID
   * @returns 商品详情
   */
  getGoodsInfo(id: string) {
    return http.get<GoodsInfo>(`/goods/${id}`);
  }

  /**
   * 向购物车中添加商品
   * @param goodsId 商品ID
   * @param cartId 购物车ID
   * @param quantity 添加的数量
   * @returns null
   */
  addGoodsToShoppingCart(goodsId: string, cartId: string, quantity: number) {
    return http.post('/shop_cart', {
      goods_no: goodsId,
      shop_cart_id: cartId,
      num: quantity,
    });
  }
  
  /**
   * 从购物车中删除商品
   * @param goodsId 商品ID
   * @param cartId 购物车ID
   * @param quantity 删除的数量
   * @returns null
   */
  deleteGoodsFromShoppingCart(goodsId: string, cartId: string, quantity: number) {
    return http.delete('/shop_cart', {
      goods_no: goodsId,
      shop_cart_id: cartId,
      num: quantity,
    });
  }
}

export default new CartService();