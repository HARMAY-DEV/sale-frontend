<template>
  <div class="cart-container" style="background: #f8f8f8">
    <div class="input-container">
      <div class="input-group">
        <el-input
          style="width: 80%; height: 40px"
          ref="searchInput"
          type="search"
          @keyup.enter.native="search()"
          clearable
          v-model="searchGoodsNo"
          placeholder="条码、名称、商家编码"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          <!-- <el-button slot="append" icon="el-icon-search" @click="search()"></el-button> -->
        </el-input>
      </div>
      <div class="member-group" @click.stop="memberLogin">
        <div class="img-box">
          <img src="../assets/images/head_photo.png" alt="" />
        </div>
        <p class="tips">未登录会员</p>
      </div>
    </div>
    <div v-if="goodsList.length" class="goods-list">
      <goods-card
        v-for="goods in goodsList"
        :key="goods.id"
        v-bind="goods"
        :goodObj="goods"
        @bindGoodItem="bindGoodItem"
      ></goods-card>
    </div>
    <div v-else class="goods-list" @touchmove.stop>
      <h2 class="empty-goods">空空如也~</h2>
    </div>
    <div class="footer">
      <el-button
        @click="discountBtn()"
        style="background-color:#000;color:#fff;"
        :class="['btn add-btn', { active: goodsList && goodsList.length > 0 }]"
        >添加临时优惠</el-button
      >
      <el-button
       style="background-color:#000;color:#fff;"
        @click="discountBtn2()"
        :class="[
          'btn choose-btn',
          { active: goodsList && goodsList.length > 0 },
        ]"
        >选择优惠</el-button
      >
      <!--      <el-button :disabled="!goodsList.length" type="danger" @click="clearSn()">移除一物一码</el-button>-->
      <p
        @click="clearCart()"
        style="font-size: 16px; margin-left: 45px; flex: 1"
      >
        清空购物车
      </p>
      <div class="goods-summary">
        <div style="display: flex">
          <p>
            <span style="color: #7f7f7f; margin-right: 3px"
              >店铺优惠：已选择</span
            ><span style="color: #b51f29; margin-right: 10px">3张优惠卷</span>
          </p>
          <p>
            <span style="color: #7f7f7f; margin-right: 3px">共计优惠</span
            ><span style="color: #b51f29; margin-right: 15px">80元</span>
          </p>
          <p @click="viewDetails">
            <span style="font-weight: 550; margin-right: 3px">查看详情</span>
            <img
              class="label4"
              referrerpolicy="no-referrer"
              src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngff26f446b15bdc051ae67b3dc53f36fddbe21a0c6e0caeb2d3f541a425bb8abb"
            />
          </p>
        </div>
        <div style="display: flex">
          <p class="list-len-box">
            已选商品 <span>{{ totalCount }} </span>件
          </p>
          <p class="total-box">
            合计： <span>{{ totalAmount }}</span>
          </p>
        </div>
      </div>
      <!-- 这里的付款实际上为创建订单，付款弹窗的付款才为实际的付款 -->
      <el-button
        style="
          width: 134px;
          height: 66px;
          background: #000;
          color: #fff;
          margin-right: 24px;
          border-radius: 10px;
        "
        :disabled="!goodsList.length"
        type="success"
        @click="createNewOrder"
        >结算</el-button
      >
    </div>
    <el-drawer
      ref="addCartDrawer"
      :visible.sync="searchPanelVisible"
      direction="btt"
      :modal-append-to-body="false"
      :show-close="false"
      size="50%"
      custom-class="search-panel"
    >
      <div v-if="searchGoods">
        <goods-card
          v-bind="searchGoods"
          from-search
          @close-panel="searchPanelVisible = false"
        ></goods-card>
        <div
          @click="closeDrawer"
          style="
            width: 100%;
            height: 96px;
            text-align: center;
            line-height: 96px;
            background: #f8f8f8;
            font-size: 18px;
            color: #000;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            font-weight: bold;
          "
        >
          取消
        </div>
      </div>
      <p v-else>找不到该商品，请核实</p>
    </el-drawer>
    <!-- 支付弹窗 -->
    <order-process
      :payDialogVisible="payDialogVisible"
      @closePayDialog="closePayDialog"
    ></order-process>
    <!--    移除一物一码-->
    <div v-if="snState == 1">
      <div
        @click="snCancle()"
        style="
          width: 100%;
          height: 100%;
          position: fixed;
          z-index: 1000;
          top: 0;
          left: 0;
          background: #000;
          opacity: 0.6;
        "
      ></div>
      <div class="sn">
        <div class="snTitle" @click="snCancle()">
          <img
            src="../assets/images/return01.png"
            style="width: 17px; height: 17px"
            alt=""
          />
          <p style="font-size: 14px; color: #000; margin-left: 13px">
            取消移除
          </p>
        </div>
        <div class="snDetail">
          <p
            style="
              font-size: 16px;
              color: #000;
              line-height: 22px;
              margin-right: 14px;
            "
          >
            商品编码
          </p>
          <el-input
            style="width: 254px"
            ref="searchInput2"
            type="search"
            placeholder="单行输入"
            clearable
            v-model="searchGoodsNo2"
          >
          </el-input>
        </div>
        <div style="margin-top: 60px; display: flex; justify-content: center">
          <p
            @click="snCancle()"
            style="
              width: 142px;
              height: 44px;
              border-radius: 10px;
              border: 1px solid #000000;
              line-height: 44px;
              text-align: center;
              font-size: 18px;
              color: #000;
              font-weight: 500;
            "
          >
            取消
          </p>
          <!--          <el-button type="info" style="" @click="snCancle()">取消</el-button>-->
          <!--          <el-button type="primary" style="margin-right: 60px;" @click="search2()">确定</el-button>-->
          <p
            @click="search2()"
            style="
              width: 142px;
              height: 44px;
              border-radius: 10px;
              border: 1px solid #000000;
              line-height: 44px;
              text-align: center;
              font-size: 18px;
              color: #fff;
              font-weight: 500;
              background: #000;
              margin-left: 36px;
            "
          >
            确定
          </p>
        </div>
      </div>
    </div>
    <!-- 会员优惠券 -->
    <template v-if="discountState == 1">
      <temporary-discount @discountClose="discountClose"></temporary-discount>
    </template>
    <!-- 选择优惠 -->
    <template v-if="temporaryState == 1">
      <choose-discount @discountClose="discountClose"></choose-discount>
    </template>
    <!-- 商品优惠 -->
    <template v-if="temporaryState == 2">
      <good-discount
        @discountClose="discountClose"
        ref="goodDiscount"
      ></good-discount>
    </template>
    <!-- 登录弹窗 -->
    <LoginMode
      style=""
      :loginDialogVisible.sync="loginDialogVisible"
      @changDialogVisible="changDialogVisible"
    >
    </LoginMode>
    <!-- 查看详情 -->
    <el-drawer :visible.sync="detailsDrawer" :direction="direction" :showClose='false'>
      <div class="productDetails" v-for="(item,index) in goodsList" :key="index">
        <div style="display: flex">
          <img
            class="pic3"
            style="border-radius: 8px"
            referrerpolicy="no-referrer"
            :src="item.picture"
          />
          <p
            style="
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              margin-left: 15px;
            "
          >
            <span style="font-size: 20px">
              {{item.name}}
            </span>
            <span
              style="
                background-color: #f8f8f8;
                width: max-content;
                padding: 0 13px 0 7px;
                height: 36px;
                font-size: 18px;
                color: #a1a5a7;
                line-height: 36px;
              "
            >
              {{item.spec.name}}
            </span>
          </p>
        </div>
        <div class="detailTail">
          <p style=" font-size: 20px;">￥{{item.price}}.00</p>
          <img
            class="pic2"
            referrerpolicy="no-referrer"
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPnga1b76610e0af759785ea6f6c7bda83535a563b4e8805ad8795a621313a438d14"
          />
        </div>
      </div>
      <div style="height:102px;">
           <div class="cancel" @click="detailsDrawer=false">取消</div>
      </div>
   
    </el-drawer>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import GoodsCard from "@/components/goods-card.vue";
import OrderProcess from "@/components/OrderProcess.vue";
import { OrderStatus } from "@/utils/consts";
import GoodDiscount from "@/components/GoodDiscount";
import TemporaryDiscount from "@/components/TemporaryDiscount";
import ChooseDiscount from "@/components/ChooseDiscount";
// import { websocketLink } from "../utils/websocket";
// import { getHeaderImage } from "@/api/user"
import IphoneKeyword from "@/components/IphoneKeyword.vue";
import LoginMode from "@/components/LoginMode.vue";
export default {
  name: "Cart",
  components: {
    GoodsCard,
    OrderProcess,
    GoodDiscount,
    TemporaryDiscount,
    ChooseDiscount,
    IphoneKeyword,
    LoginMode,
  },

  data() {
    const url = require("../assets/images/select01.png");
    const url2 = require("../assets/images/select02.png");
    return {
      searchPanelVisible: false,
      payDialogVisible: false,
      loginDialogVisible: false,
      searchGoodsNo: "",
      searchGoodsNo2: "",
      keyboardNo: "",
      snState: 0,
      discountState: 0,
      discountNum: "",
      temporaryState: 0,
      temporaryType: 0,
      num: 1,
      detailsDrawer: false,
      direction: "btt",
    };
  },

  computed: {
    ...mapState("order", ["orderId", "orderStatus"]),
    ...mapState("cart", [
      "searchGoods",
      "goodsList",
      "totalAmount",
      "totalCount",
    ]),
    // ...mapState(["userObj", "type","Image"]),
  },
  created() {},
  mounted() {
    // websocketLink();
    this.$refs.searchInput.focus();
    window.addEventListener("keydown", this.gunHandler);
    window.addEventListener("orientationchange", () => {
      console.log(window.orientation);
      switch (window.orientation) {
        case 0:
        case 90:
          this.$router.go(-1);
          break;
        case -90:
          this.$router.push("/member-login");
          break;
        case 180:
      }
    });
  },
  deactivated() {
    window.removeEventListener(
      "orientationchange",
      () => {
        console.log("移除旋转事件成功");
      },
      false
    );
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.gunHandler);
    window.removeEventListener(
      "orientationchange",
      () => {
        console.log("移除旋转事件成功");
      },
      false
    );
  },

  methods: {
    ...mapMutations("cart", ["clearCart"]),
    ...mapActions("cart", [
      "getGoodsInfo",
      "getCartGoodsList",
      "removeFromCart",
    ]),
    ...mapActions("order", ["createOrder", "refundWholeOrder"]),
    ...mapActions("h5", ["setMeauTrue", "clearInfo"]),
    closePayDialog(isShow) {
      this.payDialogVisible = isShow;
    },
    memberLogin() {
      this.loginDialogVisible = !this.loginDialogVisible;
    },
    changDialogVisible(state) {
      this.loginDialogVisible = state;
    },
    bindGoodItem(obj) {
      this.temporaryState = 2;
      this.$nextTick(() => {
        this.$refs.goodDiscount.setEdit(obj);
      });
    },
    gunHandler(event) {
      if (this.$refs.searchInput.focused || this.payDialogVisible) {
        return;
      }

      if (event.key === "Shift") {
        return;
      }

      if (event.key === "Enter") {
        if (this.snState != 1) {
          this.search();
          this.searchGoodsNo = this.keyboardNo;
        }
      } else {
        this.keyboardNo += event.key;
      }
    },

    changDialogVisible() {},
    async search() {
      console.log("商品goodsList", this.goodsList);
      if (!this.searchGoodsNo) {
        this.$refs.searchInput.focus();
        return;
      }
      console.log("searchGoodsNo", this.searchGoodsNo);
      if (this.searchGoodsNo.indexOf("https") != -1) {
        console.log("有");
        var query = this.searchGoodsNo.split("?")[1];
        var snCode = this.getQueryString(query);
        this.keyboardNo = "";
        for (var i = 0; i < this.goodsList.length; i++) {
          if (snCode == this.goodsList[i].sn) {
            return;
          }
        }
        try {
          await this.getGoodsInfo(snCode);
          this.searchPanelVisible = true;
          this.searchGoodsNo = "";
        } catch (error) {
          this.searchGoodsNo = "";
          this.$message.error(error.message);
        }
      } else {
        console.log("没有");
        try {
          await this.getGoodsInfo(this.searchGoodsNo);
          this.searchPanelVisible = true;
          this.searchGoodsNo = "";
        } catch (error) {
          this.searchGoodsNo = "";
          this.$message.error(error.message);
        }
      }
    },

    async createNewOrder() {
      this.payDialogVisible = false;
      await this.createOrder();
      this.payDialogVisible = true;
    },

    getQueryString(query) {
      // var query = url.search.substring('?');
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == "sn") {
          return pair[1];
        }
      }
      return false;
    },
    // 移除一物一码
    clearSn() {
      this.snState = 1;
    },
    snCancle() {
      this.snState = 0;
    },
    async search2() {
      if (!this.searchGoodsNo2) {
        this.$refs.searchGoodsNo2.focus();
        return;
      }
      // console.log(this.searchGoodsNo)
      if (this.searchGoodsNo2.indexOf("https") != -1) {
        var query = this.searchGoodsNo2.split("?")[1];
        var snCode = this.getQueryString(query);
        this.keyboardNo = "";
        var type = 0;
        for (var i = 0; i < this.goodsList.length; i++) {
          if (snCode == this.goodsList[i].sn) {
            type = 1;
            try {
              await this.removeFromCart({
                goodsId: this.goodsList[i].id,
                quantity: this.goodsList[i].quantity,
                sn: this.goodsList[i].sn,
              });
              this.snState = 0;
              this.searchGoodsNo2 = "";
            } catch (error) {
              this.$message.error(error.message);
            }
          }
        }
        if ((type = 0)) {
          this.$message.error("购物车没有此商品");
        }
      } else {
      }
    },
    closeDrawer() {
      this.$refs.addCartDrawer.closeDrawer();
    },
    // 添加门店优惠/添加会员优惠
    discountBtn() {
      this.discountState = 1;
    },
    discountClose() {
      this.discountState = 0;
      console.log( this.discountState = 0);
      this.temporaryState = 0;
    },
    // 选择临时优惠类型
    temporaryChange(type) {
      this.temporaryType = type;
    },
    discountBtn2() {
      this.temporaryState = 1;
    },
    // 查看详情
    viewDetails() {
      this.detailsDrawer = true;
    },
  },
};
</script>
<style lang="scss">
  .el-drawer__open .el-drawer.btt {
    animation: btt-drawer-in .8s 1ms;
}
.el-drawer.btt::-webkit-scrollbar { width: 0 !important }
.el-drawer.btt {
  border-top-left-radius: 49px;
  border-top-right-radius: 49px;
  height: 500px !important;
  overflow: auto;

  .cancel {
    width: 100%;
    height: 96px;
    background-color: #f8f8f8;
    position: fixed;
    bottom: 0;
    font-size: 30px;
    font-weight: 800;
    text-align: center;
    line-height: 96px;
  }
  .productDetails {
    display: flex;
    justify-content: space-between;
    width: 1249px;
    height: 102px;
    margin-left: 48px;
    margin-bottom: 50px;
  }
  .detailTail{
    display: flex;
    flex-direction: column;
    height: 101px;
    align-items: center;
    justify-content: space-between;
    img{
    width: 50px;
    }
  }
}
</style>
<style lang="scss">
.search-panel {
  padding: 12px;
  border-radius: 30px 30px 0 0;
}
</style>

<style lang="scss" scoped>
p {
  padding: 0;
  margin: 0;
}
.el-input__inner {
  padding: 0 !important;
  background: none !important;
}
.input-container {
  display: flex;
  // height: 100%;
  justify-content: space-between;
  & > div {
    width: 49%;
    height: 100px;
    background: #fff;
    border-radius: 2px;
    display: flex;
    align-items: center;
  }
  .input-group {
    justify-content: center;
  }
  .member-group {
    .img-box {
      margin-left: 36px;
      cursor: pointer;
    }
    .tips {
      color: #282828;
      margin-left: 22px;
    }
  }
}
.el-input-group--append .el-input__inner,
.el-input-group__prepend {
  height: 40px;
}
.el-input-number__decrease.is-disabled,
.el-input-number__increase.is-disabled {
  //background: #EFEFEF !important;
}
.el-input-number__increase {
  background: #000 !important;
  color: #fff !important;
}

.cart-container {
  position: relative;
  display: flex;
  flex-direction: column;

  .goods-list {
    display: flex;
    flex-direction: column;
    flex: auto;
    overflow-y: auto;
    margin: 12px 0;

    .empty-goods {
      margin: auto;
      text-align: center;
      color: #969696;
      font-size: 16px;
    }
  }

  .footer {
    display: flex;
    width: 100%;
    height: 140px;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    align-items: center;
    .btn {
      width: 140px;
      height: 66px;
      border-radius: 10px;
      background: #f8f8f8;
      color: #b6b6b6;
      text-align: center;
      font-size: 16px;
      &.active {
        background: #000;
        color: #fff;
      }
    }
    .add-btn {
      margin-left: 24px;
    }
    .choose-btn {
      margin-left: 15px;
    }
    .goods-summary {
      margin-right: 12px;
      display: flex;
      flex-direction: column;
      text-align: right;
      align-items: end;
      .list-len-box {
        text-align: right;
        color: #282828;
        font-size: 16px;
        line-height: 33px;
        span {
          font-size: 24px;
          color: #e31a22;
          font-weight: bold;
        }
      }
      .total-box {
        text-align: right;
        color: #282828;
        font-size: 16px;
        line-height: 33px;
        margin-left: 20px;
        span {
          font-size: 24px;
          color: #e31a22;
          font-weight: bold;
        }
      }
    }
  }
  .sn {
    border-radius: 8px;
    width: 400px;
    height: 324px;
    background: #fff;
    border-radius: 6px;
    position: fixed;
    z-index: 1111;
    top: 50%;
    left: 50%;
    margin-top: -152px;
    margin-left: -200px;
    .snDetail {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 76px;
    }
  }
}
// ::v-deep.el-drawer__open .el-drawer.btt {
//     animation: btt-drawer-in .3s 1ms;
//     border-top-right-radius: 25px;
//     border-top-left-radius: 25px;
// }
</style>