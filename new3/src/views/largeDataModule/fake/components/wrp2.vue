<template>
  <div id="wrp">
    <Left />
    <Right />
    <Emap />
  </div>
</template>

<script>
import Left from './left2'
import Right from './right2'
import Emap from './echarts/emap2'
export default {
  name: 'wrp',
  components: { Left, Right, Emap }
}
</script>

<style lang="scss" scoped>
  #wrp{
    height: calc((72% - 40px));
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
</style>
