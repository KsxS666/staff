<template>
  <div id="right">
    <EfoodWaste />
    <Ecast2 />
  </div>
</template>

<script>
import EfoodWaste from './echarts/efoodWaste'
import Ecast2 from './echarts/ecast2'
export default {
  name: 'right',
  components: { EfoodWaste, Ecast2 }
}
</script>

<style lang="scss" scoped>
  #right{
    height: 100%;
    width: 28%;
    z-index: 2;
  }
</style>
