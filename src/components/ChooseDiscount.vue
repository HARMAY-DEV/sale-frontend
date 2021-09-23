<template>
  <!-- 添加临时优惠 -->
  <div class="temporary-discount">
    <div
      @click="discountClose"
      style="
        background: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
      "
    ></div>
    <div class="discount">
      <div style="position: relative; width: 100%; height: 100%">
        <div style="display: flex">
          <div class="discount-left">
            <div class="discountTop">
              <div class="discountTop-line"></div>
              <p class="discountTop-name">会员优惠</p>
            </div>
            <div style="overflow: auto; height: 210px">
              <div
                class="discountList"
                v-for="(item, index) in membershipBenefits"
                :key="index"
              >
                <div class="discountList-left">
                  <p
                    style="font-size: 32px; color: #b51f29; font-weight: bold"
                    v-show="item.type == 'FIXED_AMOUNT'"
                  >
                    ￥{{ item.value }}
                  </p>
                  <p
                    style="font-size: 32px; color: #b51f29; font-weight: bold"
                    v-show="item.type == 'PERCENTAGE'"
                  >
                    {{ item.value }}%
                  </p>
                  <p
                    style="font-size: 32px; color: #b51f29; font-weight: bold"
                    v-show="item.type == ' PRICE_OVERRIDE'"
                  >
                    ¥20
                  </p>
                  <p style="font-size: 10px; color: #969696; margin-top: 3px">
                    满{{item.useLimit}}元使用
                  </p>
                </div>
                <div class="discountList-right">
                  <p style="font-size: 14px; color: #000; line-height: 20px">
                    {{ item.title }}
                  </p>
                  <p
                    style="
                      font-size: 11px;
                      color: #969696;
                      line-height: 16px;
                      margin-top: 8px;
                    "
                    v-show="item.scope == 'SINGLE'"
                  >
                    范围：单品优惠
                  </p>
                  <p
                    style="
                      font-size: 11px;
                      color: #969696;
                      line-height: 16px;
                      margin-top: 8px;
                    "
                    v-show="item.scope == 'WHOLE'"
                  >
                    范围：整单优惠
                  </p>
                  <p
                    style="
                      font-size: 11px;
                      color: #969696;
                      line-height: 16px;
                      margin-top: 3px;
                    "
                  >
                    期限：{{ item.start_at }}-{{ item.end_at }}
                  </p>
                </div>
              </div>
            </div>

            <div class="discountTop" style="margin-top: 32px">
              <div class="discountTop-line"></div>
              <p class="discountTop-name">不可用</p>
            </div>
            <div style="height:105px; overflow:auto;" >
                   <div class="discountList2" v-for="(item,index) in  notAvailable" :key=index>
              <div class="discountList-left">
                <p style="font-size: 32px; color: #c0c0c0; font-weight: bold" v-show="item.type=='PERCENTAGE'">
                  {{item.value}}%
                </p>
                <p style="font-size: 32px; color: #c0c0c0; font-weight: bold" v-show="item.type=='FIXED_AMOUNT'">
                  ￥{{item.value}}
                </p>
                <p style="font-size: 10px; color: #c0c0c0; margin-top: 3px">
                  满{{item.useLimit}}元使用
                </p>
              </div>
              <div class="discountList-right">
                <p style="font-size: 14px; color: #c0c0c0; line-height: 20px">
                 {{item.title}}
                </p>
                <p
                  style="
                    font-size: 11px;
                    color: #c0c0c0;
                    line-height: 16px;
                    margin-top: 8px;
                  "
                  v-show="item.scope=='SINGLE'"
                >
                  范围：单品优惠
                </p>
                <p
                  style="
                    font-size: 11px;
                    color: #c0c0c0;
                    line-height: 16px;
                    margin-top: 8px;
                  "
                  v-show="item.scope=='WHOLE'"
                >
                  范围：整单优惠
                </p>
                <p
                  style="
                    font-size: 11px;
                    color: #c0c0c0;
                    line-height: 16px;
                    margin-top: 3px;
                  "
                >
                  期限{{ item.start_at }}-{{ item.end_at }}
                </p>
              </div>
            </div>
            </div>
       
          </div>
          <div class="discount-left" style="margin-left: 82px">
            <div class="discountTop">
              <div class="discountTop-line"></div>
              <p class="discountTop-name">门店优惠</p>
            </div>
            <div style="height: 420px; overflow: auto">
              <div
                class="discountList"
                v-for="(item, index) in StoreDiscount"
                :key="index"
              >
                <div class="discountList-left">
                  <p
                    style="font-size: 32px; color: #b51f29; font-weight: bold"
                    v-show="item.type == 'PERCENTAGE'"
                  >
                    {{ item.value }}%
                  </p>
                  <p
                    style="font-size: 32px; color: #b51f29; font-weight: bold"
                    v-show="item.type == 'FIXED_AMOUNT'"
                  >
                    ￥{{ item.value }}
                  </p>
                  <p
                    style="font-size: 32px; color: #b51f29; font-weight: bold"
                    v-show="item.type == 'PRICE_OVERRIDE'"
                  >
                    {{ item.value }}%
                  </p>
                  <p style="font-size: 10px; color: #969696; margin-top: 3px">
                    满{{ item.useLimit }}元使用
                  </p>
                </div>
                <div class="discountList-right">
                  <p style="font-size: 14px; color: #000; line-height: 20px">
                    {{ item.title }}
                  </p>
                  <p
                    style="
                      font-size: 11px;
                      color: #969696;
                      line-height: 16px;
                      margin-top: 8px;
                    "
                    v-show="item.scope == 'SINGLE'"
                  >
                    范围：单品优惠
                  </p>
                  <p
                    style="
                      font-size: 11px;
                      color: #969696;
                      line-height: 16px;
                      margin-top: 8px;
                    "
                    v-show="item.scope == 'WHOLE'"
                  >
                    范围：整单优惠
                  </p>
                  <p
                    style="
                      font-size: 11px;
                      color: #969696;
                      line-height: 16px;
                      margin-top: 3px;
                    "
                  >
                    期限：{{ item.start_at }}-{{ item.end_at }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="discountFooter">
          <p
            style="
              font-size: 24px;
              color: #000;
              margin-left: 30px;
              font-weight: bold;
            "
          >
<<<<<<< HEAD
            ¥0
=======
            ¥279
>>>>>>> faa4eb0e90948d23333d55a27bb9c40495d03848
          </p>
          <p
            style="
              font-size: 16px;
              color: #969696;
              margin-left: 16px;
              flex: 1;
              margin-top: 4px;
              text-decoration: line-through;
            "
          >
<<<<<<< HEAD
            ¥0
=======
            ¥350
>>>>>>> faa4eb0e90948d23333d55a27bb9c40495d03848
          </p>
          <el-button
            @click="close"
            style="
              width: 114px;
              height: 54px;
              border-radius: 10px;
              background: #000;
              font-size: 18px;
              color: #fff;
              margin-right: 30px;
            "
            >确定</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allData: [
        {
          type: "FIXED_AMOUNT",
          status: "ACTIVE",
          value: 20,
          start_at: "2021.01.08",
          end_at: "2021.10.08",
          title: "纯露化妆水无门槛20元券",
          scope: "WHOLE",
          useLimit: 200,
        },
        {
          type: "PERCENTAGE",
          status: "ACTIVE",
          value: 20,
          start_at: "2021.01.08",
          end_at: "2021.10.08",
          title: "纯露化妆水无门槛20元券",
          scope: "SINGLE",
          useLimit: 100,
        },
        {
          type: "PERCENTAGE",
          status: "NOT_AVAILABLE",
          value: 20,
          start_at: "2021.01.08",
          end_at: "2021.10.07",
          title: "纯露化妆水无门槛20元券",
          scope: "WHOLE",
          useLimit: 1000,
        },
        {
          type: "FIXED_AMOUNT",
          status: "NOT_AVAILABLE",
          value: 20,
          start_at: "2021.01.08",
          end_at: "2021.10.10",
          title: "纯露化妆水无门槛20元券",
          scope: "SINGLE",
          useLimit: 10,
        },
      ],
      StoreDiscount: [
        {
          type: "FIXED_AMOUNT",
          status: "ACTIVE",
          value: 20,
          start_at: "2021.01.08",
          end_at: "2021.10.08",
          title: "纯露化妆水无门槛20元券",
          scope: "SINGLE",
          useLimit: 100,
        },
        {
          type: "PERCENTAGE",
          status: "NOT_AVAiLABLE",
          value: 20,
          start_at: "2021.01.08",
          end_at: "2021.10.08",
          title: "纯露化妆水无门槛20元券",
          scope: "WHOLE",
          useLimit: 100,
        },
        {
          type: "PERCENTAGE",
          status: "NOT_AVAILABLE",
          value: 20,
          start_at: "2021.01.08",
          end_at: "2021.10.08",
          title: "纯露化妆水无门槛20元券",
          scope: "SINGLE",
          useLimit: 100,
        },
      ],
      notAvailable:[],
      membershipBenefits:[]
    };
  },
  methods: {
    discountClose() {
      this.$emit("discountClose");
    },
    close() {
      this.$emit("discountClose");
    },
    distinguish(){
      this.notAvailable = this.allData.filter(item=>{
      return  item.status=='NOT_AVAILABLE'
      })
      console.log(this.notAvailable);
      this.membershipBenefits = this.allData.filter(item=>item.status=='ACTIVE')
      console.log(this.membershipBenefits);
    }
  },
  created(){
    this.distinguish()
  }
};
</script>

<style lang="scss" scoped>
.temporary-discount {
  //会员优惠券
  .discount {
    width: 713px;
    height: 572px;
    background: #fff;
    border-radius: 8px;
    position: fixed;
    z-index: 10;
    top: 50%;
    left: 50%;
    margin-top: -286px;
    margin-left: -356px;
    .discount-left {
      margin-left: 30px;
      margin-top: 40px;
      .discountTop {
        display: flex;
        align-items: center;
        padding-bottom: 8px;
        .discountTop-line {
          width: 2px;
          height: 12px;
          background: #b51f29;
        }
        .discountTop-name {
          font-size: 16px;
          color: #000;
          line-height: 22px;
          margin-left: 8px;
        }
      }
      .discountList {
        width: 287px;
        height: 94px;
        background-image: url("../assets/images/discountBck.png");
        background-size: 100% auto;
        margin-top: 11px;
        display: flex;
        align-items: center;
        .discountList-left {
          margin-left: 10px;
          text-align: center;
        }
        .discountList-right {
          margin-left: 30px;
        }
      }
      .discountList2 {
        width: 287px;
        height: 94px;
        background-image: url("../assets/images/discountBck2.png");
        background-size: 100% auto;
        margin-top: 11px;
        display: flex;
        align-items: center;
        .discountList-left {
          margin-left: 10px;
          text-align: center;
        }
        .discountList-right {
          margin-left: 30px;
        }
      }
    }
    .discountFooter {
      height: 99px;
      width: 100%;
      position: absolute;
      bottom: 0;
      border-top: 1px solid #eeeeee;
      display: flex;
      align-items: center;
    }
  }
}
</style>