<template>
  <div class="home-container">
    <el-menu
      :default-active="$route.name"
      mode="horizontal"
      background-color="#000"
      text-color="rgba(255, 255, 255, 0.6)"
      active-text-color="#fff"
      router
      style="width:100vw;"
      v-show="isShowMeau"
    >
      <el-menu-item index="shopping-cart">收银</el-menu-item>
      <el-menu-item index="order">订单管理</el-menu-item>
      <el-menu-item index="device">设备管理</el-menu-item>

      <router-link to="/profile" class="avatar-container">
        <el-avatar icon="el-icon-user"></el-avatar>
      </router-link>
      <div class="signOut">退出</div>
    </el-menu>
    <div class="main-content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { addOrder } from "@/api/index";
import { mapState } from "vuex";
export default {
  name: "Home",

  methods: {
    chuw() {
      addOrder().then((res) => {
        console.log(res, "ddddd");
      });
    },
  },
  computed: {
    ...mapState('h5', ["isShowMeau"]),
  }
};
</script>

<style lang="scss">
.home-container .el-menu-item {
  padding: 0 10px;
  margin: 0 30px;
}
</style>

<style lang="scss" scoped>
.home-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.avatar-container {
  position: absolute;
  right: 50px;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}

.main-content {
  flex: 1 1 100%;
  overflow: hidden;

  > div {
    box-sizing: border-box;
    height: 100%;
    padding: 12px;
  }
}
.signOut {
  font-size: 16px;
  color: #fff;
  position: absolute;
  right: 23px;
  line-height: 60px;
}
</style>
