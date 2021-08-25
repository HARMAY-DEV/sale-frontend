<template>
  <div class="number-keyboard-container">
    <div class="input-group">
      <el-input placeholder="请输入收款金额" v-model="value" class="input" readonly></el-input>
      <img src="../assets/images/keyword-del.png" class="img" @click.prevent.stop="backspace($event)" @touchend.prevent.stop="backspace($event)">
    </div>
    <slot name="money-btn"></slot>
    <div class="number-keyboard">
      <span v-for="(item, index) in keywordOptions" :key="index" @click.prevent.stop="clickHandler($event)" @touchstart.prevent.stop="highlight($event)" @touchend.prevent.stop="handler($event)">{{item}}</span>
      <span>
        <slot></slot>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NumberKeyboard',
  props: {
    value: String,
    placeholder: String,
    keywordList: {
      type: Array,
      default: ()=> {
        return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0']
      }
    }
  },
  data() {
    return {
      keywordOptions: []
    }
  },
  watch: {
    keywordList() {
      this.keywordOptions = this.keywordList 
    }
  },
  model: {
    prop: 'value',
    event: 'typing',
  },
  mounted() {
    this.keywordOptions = this.keywordList
  },
  methods: {
    highlight({ target }) {
      target.style.backgroundColor = '#ebeef5';
    },
    clickHandler(event) {
      console.log(event);
      if (document.hasOwnProperty('ontouchstart')) {
        console.log('support touch event');
        return;
      }
      this.handler(event);
    },
    handler({ target }) {
      target.style.backgroundColor = '';
      const numStr = target.innerText;
      if (this.value.includes('.') && numStr === '.') {
        return;
      }
      if (this.value === '0' && numStr === '0') {
        this.$emit('typing', '0');
        return;
      }
      this.$emit('typing', this.value + numStr);
    },
    backspace({target}) {
      target.style.backgroundColor = '';
      if (this.value.length  === 0) return;
      this.$emit('typing', this.value.slice(0, -1));
    },
    // bindQrcodePay() {
    //   this.$emit('bindQrcodePay')
    // }
  }
}
</script>

<style lang="scss">
.number-keyboard-container {
  min-width: 475px;
  .el-input__inner:focus {
    border-color: #DCDFE6;
  }

  .el-input__suffix, .el-input__suffix-inner {
    display: flex;
    align-items: center;
  }
}
.input {
  border-radius: 10px;
  margin-left: 14px;
  width: 150px;
  .el-input__inner {
    border: 0;
    border-color: transparent;
  }
}
</style>

<style lang="scss" scoped>
.number-keyboard-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;
  -webkit-user-select: none;
  touch-callout: none;
  -webkit-touch-callout: none;
  .input-group {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    .img {
      margin-left: 10px;
    }
  }
}

.number-keyboard {
  // width: 376px;
  margin: 0 auto;
  flex: auto;
  margin-top: 34px;
  display: grid;
  grid-template-rows: 88px 88px 88px 88px;
  grid-template-columns: 88px 88px 88px;
  grid-row-gap: 37px;
  grid-column-gap: 37px;

  > span {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    transition: all ease 0.1s;
    overflow: hidden;
    background: #F1F1F1;
    border-radius: 50%;
    &:active, &:focus {
      background-color: #ebeef5;
    }
    &.column-2 {
      grid-column: 1 / span 2;
    }
    &.row-3 {
      grid-column: 4 / 4;
      grid-row: 2 / span 4;
    }
  }

  > span:last-child * {
    border: none;
    width: 100%;
    height: 100%;
  }
}
</style>