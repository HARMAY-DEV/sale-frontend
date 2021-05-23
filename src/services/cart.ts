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
  shopCartGoods: [Array<{
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
  }>, number];
}

function goodsInfoTransformer(data: any) {
  return {
    id: data.goods_id || data.goods_no,
    name: data.goods_name,
    price: data.price || 0,
    stock: data.stock || 0,
    picture: data.img_url,
    spec: data.spec_name,
    quantity: data.num || 0,
  };
}

function cartAction({ shopCartGoods: [list] }: GoodsListResponse) {
  const cartId = list[0].shop_cart_id;
  const goodsList = list.map(goodsInfoTransformer);
  return { cartId, goodsList };
}

class CartService {
  /**
   * 根据购物车ID获取商品列表
   * @param id 购物车id
   * @returns 商品列表
   */
  getShoppingCartGoodsList(id: string) {
    return http.get<GoodsListResponse>(`/shop_cart?shop_cart=${id}`)
      .then(({ shopCartGoods: [list] }) => list.map(goodsInfoTransformer));
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
   * @param quantity 添加的数量
   * @returns null
   */
  addGoodsToShoppingCart(goodsId: string, cartId: string, quantity: number) {
    console.log(goodsId, typeof goodsId);
    return http.post<GoodsListResponse>('/shop_cart', {
      goods_no: goodsId,
      shop_cart_id: cartId,
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
      num: quantity,
    }).then(cartAction);
  }
}

export default new CartService();