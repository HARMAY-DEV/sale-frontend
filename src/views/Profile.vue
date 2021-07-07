<template>
  <div>
    <h1>个人中心</h1>
    <el-button type="primary" @click="logout()">退出登录</el-button>
  </div>
</template>

<script>
import { Storage } from '@/utils/storage';

export default {
  name: 'Profile',
  methods: {
    logout() {
      Storage.clear();
      location.reload();
    },
  },
}
</script>

<style>

</style>