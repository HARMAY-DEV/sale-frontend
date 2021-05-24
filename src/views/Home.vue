<template>
  <div class="home-container">
    <el-menu 
      :default-active="$route.name" 
      mode="horizontal"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <el-menu-item index="shopping-cart">
        <router-link to="/shopping-cart">收银</router-link>
      </el-menu-item>
      <el-menu-item index="order">
        <router-link to="/order">订单管理</router-link>
      </el-menu-item>
      <el-menu-item index="device">
        <router-link to="/device">设备管理</router-link>
      </el-menu-item
      >
      <router-link to="/profile" class="avatar-container">
        <el-avatar icon="el-icon-user"></el-avatar>
      </router-link>
    </el-menu>
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style lang="scss">
.home-container .el-menu-item {
  padding: 0 40px;
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
  right: 0;
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
</style>
