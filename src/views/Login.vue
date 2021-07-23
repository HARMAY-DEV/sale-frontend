<template>
  <div class="login-container">
<!--    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">-->

<!--      <div class="title-container">-->
<!--        <h3 class="title">HARMAY</h3>-->
<!--      </div>-->

<!--      <el-form-item prop="username">-->
<!--        <span class="svg-container">-->
<!--          <i class="el-icon-user"></i>-->
<!--        </span>-->
<!--        <el-input-->
<!--          ref="username"-->
<!--          v-model="loginForm.username"-->
<!--          placeholder="请输入账号"-->
<!--          name="username"-->
<!--          type="text"-->
<!--          tabindex="1"-->
<!--          autocomplete="on"-->
<!--        />-->
<!--      </el-form-item>-->

<!--      <el-tooltip v-model="capsTooltip" content="大写锁定已打开" placement="right" manual>-->
<!--        <el-form-item prop="password">-->
<!--          <span class="svg-container">-->
<!--            <i class="el-icon-lock"></i>-->
<!--          </span>-->
<!--          <el-input-->
<!--            ref="password"-->
<!--            v-model="loginForm.password"-->
<!--            type="password"-->
<!--            placeholder="请输入密码"-->
<!--            name="password"-->
<!--            tabindex="2"-->
<!--            autocomplete="on"-->
<!--            @keyup.native="checkCapslock"-->
<!--            @blur="capsTooltip = false"-->
<!--            @keyup.enter.native="handleLogin"-->
<!--          />-->
<!--        </el-form-item>-->
<!--      </el-tooltip>-->

<!--      <el-form-item prop="shopId">-->
<!--        <span class="svg-container">-->
<!--          <i class="el-icon-office-building" />-->
<!--        </span>-->
<!--        <el-select-->
<!--          v-model="loginForm.shopId"-->
<!--          placeholder="请选择地址"-->
<!--          name="shopId"-->
<!--          tabindex="3"-->
<!--          autocomplete="on"-->
<!--          style="width: calc(100% - 30px);"-->
<!--        >-->
<!--          <el-option v-for="item in shopList" :key="item.value" :label="item.shopName" :value="item.shopId" :disabled="!item.isActive" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->

<!--      <el-button :loading="loading" type="primary" style="width:100%; margin-bottom: 30px;" @click.native.prevent="handleLogin">登录</el-button>-->
<!--    </el-form>-->
    <div style="margin-top: 300px;">
      <div class="title-container">
        <h3 class="title">HARMAY</h3>
      </div>
      <div style="width: 300px;margin: 40px auto;">
        <el-button :loading="loading" type="primary" style="width:300px;" @click="loginDing()">钉钉登录</el-button>
      </div>
   </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import {dingDing,dingLogin} from "@/api/index"
export default {
  name: 'Login',
  data() {
    const requiredRule = (message) => ({ required: true, trigger: 'blur', message });
    const lengthRule = (length, message) => ({ min: length, trigger: 'blur', message });
    return {
      loginForm: {
        username: '',
        password: '',
        shopId: this.shopId,
      },
      loginRules: {
        username: [requiredRule('必须输入账号！'), lengthRule(5, '账号长度大于等于5位字符！')],
        password: [requiredRule('必须输入密码！'), lengthRule(6, '密码长度大于等于6位字符！')],
        shopId: [requiredRule('必须选择地址！')],
      },
      // 大写锁定是否已打开
      capsTooltip: false,
      loading: false,
    };
  },
  computed: {
    ...mapState('user', ['shopId', 'shopList']),
  },
  mounted() {
    // console.log('钉钉登录')
    var code = this.getQueryVariable("code")
    // console.log('code ====')
    // console.log(code)
    // var userData={
    //   deptName:'北京三里屯店',
    //   unionid:'ii8ZgN6dSdp1HhoD41b0WmAiEiE',
    //   username:'薛红媛'
    // }
    // this.login(userData).then(() => {
    //   this.$router.replace({ path: '/' });
    // }).catch((error) => {
    //   this.$notify.error({ title: '登录失败', message: error.message });
    // }).finally(() => {
    //   this.loading = false;
    // });
    if(!code){
      // console.log('无code')
    }else{
      // console.log('有code')
      dingDing(code).then(res=>{
        console.log(res.data)
        if(res.data.code==200){
          var userData = res.data.data
          this.loading = true;
          this.login(userData).then(() => {
            this.$router.replace({ path: '/' });
          }).catch((error) => {
            this.$notify.error({ title: '登录失败', message: error.message });
          }).finally(() => {
            this.loading = false;
          });
        }
      })
    }
    this.getShopList();

    if (this.loginForm.username === '') {
      this.$refs.username.focus();
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus();
    }
  },
  methods: {
    ...mapActions('user', ['login', 'getShopList']),

    checkCapslock({ key }) {
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z');
    },

    handleLogin() {

      this.$refs.loginForm.validate(valid => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        this.login(this.loginForm).then(() => {
          this.$router.replace({ path: '/' });
        }).catch((error) => {
          this.$notify.error({ title: '登录失败', message: error.message });
        }).finally(() => {
          this.loading = false;
        });
      });
    },
    loginDing(){
      window.open('https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=dingiva41ovpwg6hbb25&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=https://testh5.outiejun.com/login')
    },
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
      }
      return(false);
    }
  },
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.el-scrollbar__bar {
  opacity: 1 !important;
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-select .el-input {
    width: 100%;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    box-sizing: border-box;
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
