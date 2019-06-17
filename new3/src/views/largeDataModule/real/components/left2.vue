<template>
  <div id="left">
    <Actual />
    <Regc />
  </div>
</template>

<script>
import Actual from './table/actual2'
import Regc from './echarts/regc2'
export default {
  components: { Actual, Regc }
}
</script>

<style lang="scss" scoped>
  #left{
    height: 100%;
    width: 25%;
    z-index: 2;
  }
</style>
