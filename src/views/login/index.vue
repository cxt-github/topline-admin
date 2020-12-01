<template>
  <div class="login-warp">
    <div class="login-div">
      <div class="login-logo">
        <img src="../../assets/img/login_logo.png" alt="" />
      </div>
      <div class="login-form">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <el-form-item prop="mobile">
            <el-input
              v-model="ruleForm.mobile"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="proof">
            <el-row>
              <el-col :span="12">
                <el-input
                  v-model="ruleForm.proof"
                  placeholder="请输入验证码"
                ></el-input>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-button>发送验证码</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      ruleForm: {
        mobile: "18801185985",
        proof: "246810",
      },
      rules: {
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "手机号码有误", trigger: "blur" },
        ],
        proof: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 6, max: 6, message: "验证码有误", trigger: "blur" },
        ],
      },
    };
  },
};
</script>

<style lang="less" scoped>
.login-warp {
  background: url("../../assets/img/login_bg.jpg") no-repeat center / cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-div {
    width: 30%;
    // height: 300px;
    background-color: #fff;
    padding: 30px 0;

    .login-logo {
      text-align: center;

      img {
        width: 40%;
      }
    }

    .login-form {
      padding: 25px 40px 0;
    }
  }
}
</style>
