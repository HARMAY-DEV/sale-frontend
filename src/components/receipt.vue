<template>
  <div class="print-receipt">
    <div class="header">
      <div class="top">
        <span>HARMAY 話梅</span>
        <span>{{ shopName }}</span>
        <span>{{ date }}</span>
      </div>
      <div class="bottom">
        <span>店员英文名: {{ clerkName }}</span>
        <span>{{ time }}</span>
      </div>
    </div>

    <h1>SHOPPING LIST</h1>
    <p>PLEASE LOOK UP THE DETAILS OF THE GOODS YOU BOUGHT</p>
    
  </div>
</template>

<script>
export default {
  name: 'Receipt',
  data() {
    return {
      shopName: '北京·三里屯店',
      date: '2021.03.12 TUE',
      clerkName: 'Tom',
      time: '14:34:28',
    };
  },
  
}
</script>

<style>

</style>