<template>
  <div class="wrap">
    <div class="content-box">
      <img class="t-gr" src="./assets/images/shangyezi.png" alt="">
      <div class="c-h-box">
        <img class="c-h" src="./assets/images/3renxing.png" alt="">
      </div>
      <div class="form-wrp">
        <div class="title">欢迎登录爱家物联管理后台</div>
        <div class="input-box">
          <section>
            <span><img src="./assets/images/wode.png" alt=""></span>
            <input type="text" maxlength="30" v-model="loginForm.username" autocomplete="on" placeholder="请输入用户名" @blur="check('username')" @keyup.enter="handleLogin">
            <div class="clear v-cursor" @click="loginForm.username = ''">x</div>
          </section>
          <section>
            <span><img src="./assets/images/mima.png" alt=""></span>
            <input type="password" maxlength="30" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码" @blur="check('password')" @keyup.enter="handleLogin">
          </section>
          <p class="tip v-red">{{tipText}}</p>
        </div>
        <el-button class="loginBtn v-cursor" :loading="loading" @click.native.prevent="handleLogin">
          登录系统
        </el-button>
      </div>

    </div>
    <div class="dot dot-gray"></div>
    <div class="dot dot-white"></div>
    <div class="l-g-wrp">
      <img class="b-gr" src="./assets/images/yezi.png" alt="">
      <!-- <img class="d-d" src="./assets/images/xiaodiandian.png" alt=""> -->
    </div>
    <!-- <div class="contentBox">
      <h1 class="title">爱家物联管理后台</h1>
      <div class="inputBox">
        <input type="text" maxlength="30" v-model="loginForm.username" autoComplete="on" placeholder="账号" @blur="check('username')" @keyup.enter="handleLogin">
        <input type="password" maxlength="30" v-model="loginForm.password" autoComplete="on" placeholder="密码" @blur="check('password')" @keyup.enter="handleLogin">
        <p class="tip v-red">{{tipText}}</p>
      </div>
      <el-button class="loginBtn" :loading="loading" @click.native.prevent="handleLogin">
        登 录
      </el-button>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      // loginRules: {
      //   username: [ {required: true, trigger: 'blur', message: '请输入账号'} ],
      //   password: [ {required: true, trigger: 'blur', message: '请输入密码'} ]
      // },
      loading: false,
      tipText: ''
    }
  },
  methods: {
    check (key) {
      if (this.loginForm[key] === '') {
        this.tipText = key === 'username' ? '请输入账号' : '请输入密码'
        return false
      }
      this.tipText = ''
      return true
    },
    async handleLogin () {
      let usernameCheck = this.check('username')
      if (!usernameCheck) return false
      let passwordCheck = this.check('password')
      if (!passwordCheck) return false

      this.loading = true
      let res = await this.$post('system/admin/login', this.loginForm)
      this.loading = false

      if (res.code === 0) {
        this.$store.dispatch('SetTokenInfo', res.data)
        this.$router.push('/')
      } else {
        res.msg && this.$message.error(res.msg)
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  $gr: #5DCC95;
  $dgr: #05C3A1;
  .wrap{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    min-width: 1650px;
    min-height: 764px;
    background: #FDFDFD;
    background-size: cover;
    .dot-gray{
      position: absolute;
      top: 0;
      right: 3%;
      z-index: 5;
      width: 200px;
      height: 30%;
      background: url("./assets/images/dot-gray.png") repeat top left;
      background-size: 150px auto;
    }
    .dot-white{
      position: absolute;
      bottom: 0;
      left: 540px;
      z-index: 5;
      width: 300px;
      height: 26%;
      background: url("./assets/images/dot-white.png") repeat bottom left;
      background-size: 300px auto;
    }
    .l-g-wrp{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 75%;
      height: 50%;
      background-color: $gr;
      .b-gr{
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 20;
        width: 650px;
        height: auto;
      }
      .d-d{
        position: absolute;
        bottom: 0;
        left: 36%;
        transform: rotate(-90deg)
      }
    }
    .content-box {
      z-index: 10;
      position: relative;
      width: 88%;
      height: 82%;
      background: #FFFFFF;
      /*box-shadow: 0 10px 10px #5DCC9533, 0 0 20px rgba(204, 204, 204, .22);*/
      box-shadow: 0 0 60px 2px rgba(135,135,135, 0.2);
      .c-h-box{
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      .t-gr{
        position: absolute;
        right: -60px;
        top: 0;
      }
      .c-h{
        width: 56%;
        height: auto;
      }
      .form-wrp{
        position: absolute;
        right: 51px;
        bottom: 0;
        width: 42%;
        height: 100%;
        /*height: 76%;*/
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        .title{
          color: $dgr;
          font-size: 28px;
          font-weight: 500;
          margin-bottom: 60px;
        }
        .input-box{
          width: 48%;
          margin-bottom: 30px;
          section{
            width: 100%;
            border-bottom: 1px solid #e5e5e5;
            padding: 0 14px 6px 14px;
            height: 60px;
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            span{
              position: relative;
              &::after{
                content: '';
                position: absolute;
                left: 40px;
                top: 6px;
                display: block;
                width: 2px;
                height: 14px;
                background: #BCBCBC;
              }
            }
            img{
              margin-right: 40px;
              position: relative;
            }
            input{
              flex: 1;
              outline: 0;
              border: 0;
              position: relative;
              height: 30px;
              font-size: 18px;
            }
            .clear{
              flex: 0 0 14px;
              height: 14px;
              color: #FFFFFF;
              border-radius: 50%;
              background: #ADADAD;
              text-align: center;
              line-height: 14px;
            }
          }
        }
        .loginBtn{
          width: 48%;
          height: 36px;
          background: $dgr;
          color: #FFFFFF;
          border: 0;
        }
      }
    }
    // .contentBox{
    //   width: 380px;
    //   margin: 0 auto;
    //   /*text-align: center;*/
    //   img{
    //     display: block;
    //     width: 300px;
    //     margin: 0 30px;
    //   }
    //   .title{
    //     font-size: 36px;
    //     color: #fff;
    //     text-align: center;
    //   }
    //   .inputBox{
    //     position: relative;
    //     border: 1px solid #bbbbbb;
    //     margin: 40px 0;
    //     input {
    //       display: block;
    //       width: 100%;
    //       height: 60px;
    //       background: rgba(255, 255, 255, 0.1);
    //       font-size: 20px;
    //       padding: 0 36px;
    //       color: #fff;
    //       outline:none;
    //       border: none;
    //       border-left: 6px solid transparent;
    //       &+input{
    //         border-top: 1px solid #bbbbbb;
    //       }
    //       &:focus{
    //         background: rgba(255,255,255,0.33);
    //         border-left-color: #fff;
    //       }
    //     }
    //     .tip{
    //       position: absolute;
    //       bottom: -20px;
    //       margin: 0;
    //       left: 0;
    //     }
    //   }
    //   .loginBtn{
    //     width: 100%;
    //     height: 50px;
    //     margin-bottom: 80px;
    //     background: #fff;
    //     border-radius: 0;
    //     /*color: #252133;*/
    //     border: none;
    //     font-size: 20px;
    //   }
    // }
    ::-webkit-input-placeholder { /* WebKit browsers */
      color:    #BDBDBD;
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color:    #BDBDBD;
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
      color:    #BDBDBD;
    }
    :-ms-input-placeholder { /* Internet Explorer 10+ */
      color:    #BDBDBD;
    }
  }
</style>
