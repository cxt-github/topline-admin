<template>
  <el-row v-loading="loading">
    <el-col :span="10">
      <el-form
        ref="userInfo"
        :model="userInfo"
        label-width="80px"
        label-position="top"
      >
        <el-form-item label="媒体名称">
          <el-input v-model="userInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="媒体简介">
          <el-input
            v-model="userInfo.intro"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="头条号ID">
          <el-input v-model="userInfo.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="绑定手机">
          <el-input v-model="userInfo.mobile" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-button type="primary" @click="saveUserData">保存更新</el-button>
      </el-form>
    </el-col>
    <el-col :span="12" :offset="2">
      <!-- action：图片上传的地址 -->
      <!-- 以前我们设置的基地址，是设置axios的基地址，也就是说要通过axios发请求，才会帮我们添加基地址 -->
      <!-- 但这里用的不是axios，所以路径不能简写 -->
      <!-- 我们以前设置了axios的请求拦截，在请求拦截里把请求拦下来，加了token -->
      <!-- 但现在这里不是axios发请求，所以自己手动还要加token -->
      <!-- 因为它上传时默认的参数叫file,可能跟你接口要求的不一样，所以通过name属性来修改上传的参数名 -->
      <!-- 它默认只是发post请求 -->
      <!-- 有的时候它默认自带发请求不能满足我们的需求，所以我们需要自定义一个请求 -->
      <el-upload
        class="avatar-uploader"
        action=""
        :http-request="customUpload"
        :show-file-list="false"
      >
        <img v-if="$store.state.userInfo.photo" :src="$store.state.userInfo.photo" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "user",
  data() {
    return {
      userInfo: {
        name: "",
        intro: "",
        mobile: "",
        id: "",
        email: "",
        photo:'',
      },
      loading: true,
    };
  },

  methods: {
    //封装获取用户信息
    userData() {
      this.$axios.get("/mp/v1_0/user/profile").then((res) => {
        this.userInfo = res.data.data;
        this.$store.commit('changeUserInfo',this.userInfo)
        this.loading = false;
      });
    },

    //点击修改用户信息事件
    saveUserData() {
      this.$axios
        .patch("/mp/v1_0/user/profile", this.userInfo)
        .then((res) => {
          if (res.data.message.toLowerCase() == "ok") {
            this.$message.success("修改成功");
            // 修改后的数据要给vuex更新
            this.$store.commit('changeUserInfo',this.userInfo)
          }
        })
        .catch((error) => {
          this.$message.error("修改失败");
        });
    },

    //上传图片
    customUpload(data){
      // console.log(data.file);
      // 自己发请求上传文件要用FormData对象
      const fd = new FormData()
      // 参数1：参数名
      // 参数2：真正要上传的值
      fd.append('photo',data.file)
      this.$axios.patch('/mp/v1_0/user/photo',fd)
      .then(res=>{
        console.log(res);
        // this.userInfo.photo = res.data.data.photo
        // 修改后的数据要给vuex更新
        this.$store.commit('changeUserInfo',this.userInfo)
      })
    }
    
  },

  created() {
    //获取用户信息
    this.userData();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
