<template>
  <div>
    <div class="cover-wrap" @click="centerDialogVisible = true">
      <div class="xztu" v-if="!isShowImg">点击选择图片</div>
      <div class="tb" v-if="!isShowImg">
        <i class="iconfont icon-image_upload"></i>
      </div>
      <img v-if="isShowImg" :src="imageUrl"  alt="">
    </div>
    <el-dialog :visible.sync="centerDialogVisible" width="40%" center>
      <el-tabs v-model="activeName">
        <el-tab-pane label="素材库" name="first">
            <media @checked="imageUrl=$event"></media>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="headers"
            name="image"
            :on-success="onSuccess"
            :show-file-list="false"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//导入本地token
import { getToken } from "../../../../utils/token";
//导入media.vue
import media from './media.vue'

export default {
  name: "upimg",
  components:{
      media
  },

  data() {
    return {
      isShowImg: false,
      centerDialogVisible: false,
      activeName: "first",
      imageUrl: '',
      headers: {
          Authorization: `Bearer ${JSON.parse(getToken()).token}`,
      }
    };
  },

  methods: {
      //图片上传成功的回调函数
      onSuccess(response, file, fileList) {
          this.imageUrl = response.data.url
      },

      //点击确定事件
      doOK() {
        this.isShowImg = true

        this.centerDialogVisible = false

        this.$emit('change',this.imageUrl)
      }
  },
};
</script>

<style lang="less">
.cover-wrap {
  padding: 5px;
  width: 200px;
  height: 200px;
  border: 1px solid #eee;
  border-radius: 5px;

  img {
      width: 100%;
      height: 100%;
  }

  .xztu {
    font-size: 20px;
    margin: 20px 0 20px 0;
    text-align: center;
  }

  .tb {
    text-align: center;
    .iconfont {
      font-size: 120px;
      color: #eee;
      width: 120px;
      height: 120px;
    }
  }
}

 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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
