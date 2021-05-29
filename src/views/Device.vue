<template>
  <div class="device-container">
    <h2>打印机</h2>
    <div class="device-list">

    </div>
    <h2>其他设备</h2>
    <div class="device-list">

    </div>

    <el-button @click="print()">打印</el-button>
  </div>
</template>

<script>
export default {
  name: 'Device',
  methods: {
    print() {

    }
  }
}
</script>

<style lang="scss" scoped>
.device-container {
  padding: 10px;
}
</style>