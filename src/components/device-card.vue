<template>
  <div class="device-card">
    <div class="device-name"></div>
    <dvi class="device-actions">
      <el-button>测试链接</el-button>
      <el-button>删除打印机</el-button>
    </dvi>
  </div>
</template>

<script>
export default {
  name: 'DeviceCard',
}
</script>

<style lang="scss" scoped>
.device-card {
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border: 1px solid #ebeef5;
  border-radius: 2px;
}
</style>