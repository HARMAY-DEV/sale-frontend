<template>
  <div class="number-keyboard-container">
    <div class="input-group">
      <span>输入金额</span>
      <el-input placeholder="请输入金额" v-model="value" class="input" readonly></el-input>
    </div>
    <div class="number-keyboard" @click.prevent.stop="clickHandler($event)" @touchstart.prevent.stop="highlight($event)" @touchend.prevent.stop="handler($event)">
      <span>1</span>
      <span>2</span>
      <span>3</span>
      <span @click.prevent.stop="backspace($event)" @touchend.prevent.stop="backspace($event)">
        <img src="../assets/images/keyword-del.png">
      </span>
      <span>4</span>
      <span>5</span>
      <span>6</span>
      <span @touchstart.stop @touchend.stop @click.prevent.stop class="pay-btn row-3"><slot></slot></span>
      <span>7</span>
      <span>8</span>
      <span>9</span>
      <span class="column-2">0</span>
      <span>.</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NumberKeyboard',
  props: {
    value: String,
    placeholder: String
  },
  data() {
    return {
    }
  },
  model: {
    prop: 'value',
    event: 'typing',
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
    }
  }
}
</script>

<style lang="scss">
.number-keyboard-container {
  .el-input__inner:focus {
    border-color: #DCDFE6;
  }

  .el-input__suffix, .el-input__suffix-inner {
    display: flex;
    align-items: center;
  }
}
</style>

<style lang="scss" scoped>
.number-keyboard-container {
  padding-bottom: 50px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;
  -webkit-user-select: none;
  touch-callout: none;
  -webkit-touch-callout: none;
  .input-group {
    margin-top: 39px;
    span {
      font-size: 16px;
      color: #000;
      font-weight: bold;
    }
    .input {
      width: 291px;
      height: 49px;
      border-radius: 10px;
      margin-left: 14px;
    }
  }
}

.number-keyboard {
  width: 376px;
  height: 210px;
  margin: 0 auto;
  flex: auto;
  margin-top: 50px;
  display: grid;
  grid-template-rows: repeat(4, minmax(25%, 1fr));
  grid-template-columns: repeat(4, 1fr);

  > span {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ebeef5;
    font-size: 16px;
    font-weight: 600;
    transition: all ease 0.1s;
    overflow: hidden;
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