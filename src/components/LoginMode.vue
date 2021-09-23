<template>
  <div class="LoginMode">

    <el-dialog :visible.sync="isShowLogin" :close-on-click-modal="true">
      <div class="nav">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="扫描会员码" name="first">
            <div class="scanning">
               <p>请将会员码放在取景框内</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="输入手机号" name="second">
            <div style="height: 500px">
              <div class="output">
                <input
                  class="iput"
                  v-model="moblie"
                  type="text"
                  placeholder="请输入手机号"
                />
                <img
                  class="label1"
                  @click="remove"
                  referrerpolicy="no-referrer"
                  src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng87ffd415ad66361a1c55ca57e5b358c229ac1d7251248baf576550e0f7b29d3e"
                />
              </div>
              <div class="keyboard" style="">
                <div>
                  <el-button type="info" plain @click="add(1)">1</el-button>
                  <el-button type="info" plain @click="add(2)">2</el-button>
                  <el-button type="info" plain @click="add(3)">3</el-button>
                </div>
                <div>
                  <el-button type="info" plain @click="add(4)">4</el-button>
                  <el-button type="info" plain @click="add(5)">5</el-button>
                  <el-button type="info" plain @click="add(6)">6</el-button>
                </div>
                <div>
                  <el-button type="info" plain @click="add(7)">7</el-button>
                  <el-button type="info" plain @click="add(8)">8</el-button>
                  <el-button type="info" plain @click="add(9)">9</el-button>
                </div>
                <div>
                  <el-button
                    type="info"
                    plain
                    @click="empty"
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                    >清空</el-button
                  >
                  <el-button type="info" plain @click="add(0)">0</el-button>
                  <el-button
                    type="info"
                    plain
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                    >确定</el-button
                  >
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="展示签到码" name="third">
            <div class="scanCode" style="height: 500px">
                <p>请顾客使用微信二维码</p>
             <img
              class="img1"
              referrerpolicy="no-referrer"
              src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng725a81591ca1e4fac46b6d6d8e287056dd53092929e4787011dc621847de64f8"
            />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    loginDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isShowLogin: false,
      activeName: "first",
      moblie: "",
    };
  },
  mounted() {},
  methods: {
    handleClick() {},
    remove() {
      this.moblie = this.moblie.slice(0, -1);
    },
    empty() {
      this.moblie = "";
    },
    add(n) {
      this.moblie += n;
    },
  },
  watch: {
    loginDialogVisible() {
      this.isShowLogin = this.loginDialogVisible;
    // 这是子组件接收
    },
  },
};
</script>
<style lang="scss">
  .el-tabs__nav-wrap::after{
    height: 0px;
  }
  .el-tabs__active-bar{
    width: 52%;
  }
  .el-tabs__active-bar{
    background: #000;
    
  }
</style>
<style lang="scss" scoped>
::v-deep div.el-dialog__body {
  height: 538px;
}
.el-tabs__nav {
  display: flex;
}
.output {
  width: 310px;
  display: flex;
  justify-content: space-around;
  margin: 37px auto 0;
  .label1 {
    z-index: 116;
    width: 27px;
    height: 22px;
    margin-top: 10px;
  }
  .iput {
    border: none;
    outline: medium;
    width: 287px;
    font-size: 30px;
  }
}
.keyboard {
  width: 377px;
  margin: 34px auto;
  div {
    width: 339px;
    display: flex;
    justify-content: space-around;

    margin: 10px;
    button {
      border-radius: 50%;
      width: 88px;
      height: 88px;
      font-size: 30px;
      color: #000;
    }
  }
}

.scanCode{
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    p{
        font-weight: 700;
        font-size: 16px;
        color: #000;
    }
}
.scanning{
     height: 400px;
     display: flex;
     align-items: center;
    justify-content: center;
    background: #000;
   
}
 ::v-deep .el-tabs__nav-scroll {
    width: 67%;
    /* overflow: hidden; */
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
}
</style>
