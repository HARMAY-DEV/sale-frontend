<template>
  <el-dialog
    :visible.sync="isVisible"
    :close-on-click-modal="true"
    width="400px"
    custom-class="confirm-dialog"
    destroy-on-close
    append-to-body
    @close="bindCancle"
  >
    <p class="title">{{ title }}</p>
    <p class="tips">{{ tips }}</p>
    <div class="footer-btn-box">
      <el-button @click="bindCancle">取消</el-button>
      <el-button type="primary" class="sure-btn" @click="bindSure"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    title: String,
    tips: String,
  },
  watch: {
    isShow() {
      this.isVisible = this.isShow;
    },
  },
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    bindCancle() {
      this.isVisible = false;
      this.$emit("cancle");
    },
    bindSure() {
      this.$emit("change");
    },
  },
};
</script>
<style lang="scss">
.confirm-dialog {
  box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.14);
  border-radius: 7px;
  margin-top: 35vh!important;
}
</style>
<style lang="scss" scoped>
.confirm-dialog {
  .title {
    color: #000;
    font-size: 18px;
  }
  .tips {
    color: #999;
    font-size: 14px;
    margin-top: 6px;
  }
  .footer-btn-box {
    margin-top: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-button {
        width: 124px;
        border-radius: 10px;
    }
    .sure-btn {
      margin-left: 36px;
    }
  }
}
</style>