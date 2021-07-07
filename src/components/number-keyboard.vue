<template>
  <div class="number-keyboard-container">
    <el-input :placeholder="placeholder" v-model="value" readonly prefix-icon="el-icon-coin">
      <ip-delete-two slot="suffix" theme="outline" size="26" fill="#333" @click.prevent.stop="backspace()" @touchend.prevent.stop="backspace()" />
    </el-input>
    <div class="number-keyboard" @click.prevent.stop="clickHandler($event)" @touchstart.prevent.stop="highlight($event)" @touchend.prevent.stop="handler($event)">
      <span>1</span>
      <span>4</span>
      <span>7</span>
      <span>.</span>
      <span>2</span>
      <span>5</span>
      <span>8</span>
      <span>0</span>
      <span>3</span>
      <span>6</span>  
      <span>9</span>
      <span @touchstart.stop @touchend.stop @click.prevent.stop><slot></slot></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NumberKeyboard',
  props: {
    value: String,
    placeholder: String,
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
    backspace() {
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;
  -webkit-user-select: none;
  touch-callout: none;
  -webkit-touch-callout: none;
}

.number-keyboard {
  flex: auto;
  margin-top: 10px;
  display: grid;
  grid-template-rows: repeat(3, minmax(33%, 1fr));
  grid-template-columns: repeat(4, 1fr);

  > span {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    border: 1px solid #ebeef5;
    font-size: 16px;
    font-weight: 600;
    transition: all ease 0.1s;
    overflow: hidden;

    &:active {
      background-color: #ebeef5;
    }
  }

  > span:last-child * {
    border: none;
    width: 100%;
    height: 100%;
  }
}
</style>