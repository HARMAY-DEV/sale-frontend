    <template>
  <!-- 商品优惠 -->
  <div class="good-discount-container">
    <div
      @click="discountClose"
      style="background: rgba(0, 0, 0, 0.5);width: 100%;height: 100%;position: fixed;z-index: 1;top: 0;left: 0;"
    ></div>
    <div class="goosdDiscount">
      <p class="goosdDiscount-title">
       {{goodObj.name}}
      </p>
      <div style="display: flex;margin-top: 40px;">
        <div>
          <div class="discountTop" style="margin-left: 30px;">
            <div class="discountTop-line"></div>
            <p class="discountTop-name">会员优惠</p>
          </div>
          <div class="temporaryNav">
            <p v-for="item in titleList" :key="item.id"  @click="changeDiscount(item.id)" :class="{active:item.id==temporaryType}">{{item.label}}</p>
          </div>
          <div v-if="temporaryType == 0" class="temporaryDetail">
            <input
              style="margin-left: 135px;width: 140px;background: none;font-size: 16px;padding: 0;border: none;outline: none"
              v-model="discountNum"
              placeholder="请输入折扣数字"
            />
            <p style="font-size: 20px;color: #282828;margin-left: 20px">%</p>
          </div>
          <div v-if="temporaryType == 1" class="temporaryDetail2">
            <input
              style="margin-left: 135px;width: 140px;background: none;font-size: 16px;padding: 0;border: none;outline: none"
              v-model="discountNum"
              placeholder="请输入优惠价格"
            />
            <p style="font-size: 20px;color: #282828;margin-left: 20px">元</p>
          </div>
        </div>
        <div style="margin-left: 82px">
          <div class="discountTop">
            <div class="discountTop-line"></div>
            <p class="discountTop-name">可用会员优惠券</p>
          </div>
          <div class="discountList">
            <div class="discountList-left">
              <p style="font-size: 32px;color: #B51F29;font-weight: bold">
                ¥20
              </p>
              <p style="font-size: 10px;color: #969696;margin-top: 3px;">
                满100元使用
              </p>
            </div>
            <div class="discountList-right">
              <p style="font-size: 14px;color: #000;line-height: 20px;">
                纯露化妆水无门槛20元券
              </p>
              <p
                style="font-size: 11px;color: #969696;line-height: 16px;margin-top: 8px;"
              >
                范围：单品优惠
              </p>
              <p
                style="font-size: 11px;color: #969696;line-height: 16px;margin-top: 3px;"
              >
                期限：2021.01.08-2021.10.08
              </p>
            </div>
          </div>
          <div class="discountList">
            <div class="discountList-left">
              <p style="font-size: 32px;color: #B51F29;font-weight: bold">
                8折
              </p>
              <p style="font-size: 10px;color: #969696;margin-top: 3px;">
                满100元使用
              </p>
            </div>
            <div class="discountList-right">
              <p style="font-size: 14px;color: #000;line-height: 20px;">
                纯露化妆水无门槛20元券
              </p>
              <p
                style="font-size: 11px;color: #969696;line-height: 16px;margin-top: 8px;"
              >
                范围：单品优惠
              </p>
              <p
                style="font-size: 11px;color: #969696;line-height: 16px;margin-top: 3px;"
              >
                期限：2021.01.08-2021.10.08
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-group">
        <div class="footer-lf">
          <p class="price">¥279</p>
          <p class="del-price">¥350</p>
        </div>
        <div class="footer-rg">
          <el-input-number
            v-model="quantity"
            :min="1"
            :max="10"
            label="描述文字"
          ></el-input-number>
          <el-button class="sure-btn" @click="bindSureBtn" :loading="isLoadingSure">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      titleList: [
        {id: 0, label: '折扣'},
        {id: 1, label: '减价'}
      ],
      temporaryType: 0,
      discountNum: '',
      quantity: 1,
      goodObj: {},
      isLoadingSure: false
    }
  },
  mounted() {

  },
  methods: {
    changeDiscount(id) {
      this.temporaryType = id
    },
    discountClose() {
      this.$emit('discountClose')
    },
    setEdit(obj) {
      this.goodObj = obj
      this.quantity = obj.quantity
    },
    bindSureBtn() {
      this.isLoadingSure = true
      this.discountClose()
      this.isLoadingSure = false
    }
  }
};
</script>

<style lang="scss" scoped>
.good-discount-container {
  //商品优惠
  .goosdDiscount{
    width: 773px;
    height: 612px;
    background: #fff;
    border-radius: 8px;
    position: fixed;
    z-index: 10;
    top: 50%;
    left: 50%;
    margin-top: -256px;
    margin-left: -386px;
    .goosdDiscount-title{
      font-size: 18px;
      padding-top: 40px;
      margin-left: 30px;
    }
    .discountFooter{
      height: 99px;
      width: 100%;
      position: absolute;
      bottom: 0;
      border-top: 1px solid #EEEEEE;
      display: flex;
      align-items: center;
    }
    .temporaryNav{
      display: flex;
      align-items: center;
      margin: 20px 0 0 30px;
      p {
        font-size: 16px;
        color: #282828;
        & + p {
          margin-left: 30px;
        }
        &.active {
          font-weight: bold;
          color: #160000;
        }
      }
    }
    .temporaryDetail{
      width: 345px;
      height: 98px;
      background-image: url("../assets/images/discountBck3.png");
      background-size: 100% auto;
      display: flex;
      align-items: center;
      margin: 20px 0 0 30px;
    }
    .temporaryDetail2{
      width: 345px;
      height: 98px;
      background-image: url("../assets/images/discountBck4.png");
      background-size: 100% auto;
      display: flex;
      align-items: center;
      margin: 20px 0 0 30px;
    }
    .discountTop{
      display: flex;
      align-items: center;
      .discountTop-line{
        width: 2px;
        height: 12px;
        background: #B51F29;
      }
      .discountTop-name{
        font-size: 16px;
        color: #000;
        line-height: 22px;
        margin-left: 8px;
      }
    }
    .discountList{
      width: 287px;
      height: 94px;
      background-image: url("../assets/images/discountBck.png");
      background-size: 100% auto;
      margin-top: 11px;
      display: flex;
      align-items: center;
      .discountList-left{
        margin-left: 10px;
        text-align: center;
      }
      .discountList-right{
        margin-left: 30px;
      }
    }
    .footer-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 99px;
      width: 100%;
      position: absolute;
      bottom: 0;
      border-top: 1px solid #EEEEEE;
      .footer-lf {
        display: flex;
        align-items: center;
        margin-left: 30px;
        .price {
          font-size: 24px;
          color: #000;
          font-weight: bold;
        }
        .del-price {
          font-size: 16px;
          color: #969696;
          margin-left: 16px;
          text-decoration: line-through;
        }
      }
      .footer-rg {
        display: flex;
        align-items: center;
        margin-right: 30px;
        .sure-btn {
          width: 114px;
          height: 54px;
          border-radius: 10px;
          background:#000;
          font-size: 18px;
          color: #fff;
          margin-left: 100px;
        }
      }
    }
  }
}
</style>
