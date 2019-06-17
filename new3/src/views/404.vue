<template>
  <div class="wrap404">
    <img src="@/assets/404.png" alt="">
    <div class="textWrap">
      <div class="textContent">
        <span>可能原因</span>
        <div>
          <p>无该页面的权限</p>
          <p>网络信号弱</p>
          <p>输入的网址不对</p>
        </div>
      </div>
      <div>
        <el-button class="btn" plain icon="el-icon-refresh" @click="$router.go(0)">刷 新</el-button>
        <router-link to="/index">
          <el-button class="btn" plain icon="el-icon-back">返回首页</el-button>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'errorPage'
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .wrap404{
    height: 100vh;
    text-align: center;
    overflow: hidden;
    img{
      height: 300px;
      width: auto;
      margin: 120px 0 20px;
    }
    .textWrap{
      margin-top: 20px;
      .textContent{
        padding: 20px 0;
        display: flex;
        justify-content: center;
        color: #666666;
        span{
          flex: 0 0 49%;
          text-align: right;
          margin: 16px 0;
        }
        div{
          flex: 1;
          text-align: left;
          p{
            &:before{
              content: '';
              display: inline-block;
              width: 6px;
              height: 6px;
              margin: 0 10px;
              border-radius: 50%;
              background: #ccc;
              vertical-align: middle;
            }
          }
        }
      }
    }
    .btn{
      width: 120px;
      margin: 0 10px;
    }
  }

</style>
