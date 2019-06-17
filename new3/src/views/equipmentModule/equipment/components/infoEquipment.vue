<template>
  <div id="infoEquipment">
    <div>
      <span>设备数量：{{castTypeList.equipmentList ? castTypeList.equipmentList.length : 0}}</span>
      <span>满桶：{{castTypeList.fullBarrel ? castTypeList.fullBarrel : 0}}</span>
      <span v-for="(item, index) in castTypeList.typeList" :key="index">
        {{item.type}}：{{item.number}}
      </span>
    </div>

  </div>
</template>

<script>
export default {
  name: 'infoEquipment',
  props: {
    castTypeList: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
  #infoEquipment{
    width: 100%;
    height: 65px;
    border-radius: .25rem;
    padding: 0 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    line-height: 26px;
    span{
      font-size: 14px;
      line-height: 14px;
      margin-right: 20px;
      display: inline-block;
    }
  }
</style>
