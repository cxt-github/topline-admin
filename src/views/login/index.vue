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
                <el-button :disabled="sec != 60" @click="getCode">{{
                  sec == "60" ? "发送验证码" : "还有" + sec + "秒"
                }}</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="ruleForm.agree"> </el-checkbox>
            <span class="agree"
              >我已阅读并同意<a>用户协议</a>和<a>隐私条款</a></span
            >
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="width:100%"
              @click="doLogin('ruleForm')"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
//导入token
import { setToken } from "../../utils/token";
export default {
  name: "login",
  data() {
    return {
      ruleForm: {
        mobile: "18801185985",
        proof: "246810",
        agree: true,
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
        agree: [{ pattern: /true/, message: "请勾选同意", trigger: "change" }],
      },
      // 获取验证码的倒计时，默认为60
      sec: 60,
    };
  },

  methods: {
    //发送验证码点击事件
    getCode() {
      //判断是否有手机号码才开始计时
      if (this.ruleForm.mobile == "") {
        this.$message.error("请输入手机号码，(●ˇ∀ˇ●)");
        return;
      }
      this.sec--;
      //计算器
      let timerID = setInterval(() => {
        this.sec--;

        if (this.sec == "56") {
          this.ruleForm.proof = "246810";
        }

        //当计时到0就停止计时，并回到60秒
        if (this.sec == 0) {
          clearInterval(timerID);
          this.sec = 60;
        }
      }, 1000);
    },

    //点击登录事件
    doLogin(formName) {
      // 找到这个表单并调用validate方法（此方法是验证这个表单内所有元素是否全部通过规则）
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //能来到这里就代表规则全部通过，此时发请求才比较合理
          //发请求给服务器，让服务器判断账号密码是否正确
          const res = await this.$axios.post("/mp/v1_0/authorizations", {
            mobile: this.ruleForm.mobile,
            code: this.ruleForm.proof,
          });
          if (res.data.data) {
            //获取到的数据保存到本地
            //先把对象转成json字符串
            let token = JSON.stringify(res.data.data);
            setToken(token);

            this.$message({
              showClose: true,
              message: "登录成功！",
              type: "success",
            });
            //跳转home页面
            this.$router.push('/home')
          }
        } else {
          console.log("登录失败!!");
          return false;
        }
      });
    },
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

      .agree {
        margin-left: 2.5%;

        a {
          color: #32a3fb;
        }
      }
    }
  }
}
</style>
