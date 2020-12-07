<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-radio-group v-model="radio1" @change="changeMenu">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="收藏"></el-radio-button>
      </el-radio-group>
      <el-upload
        class="upload-demo"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="headers"
        name="image"
        :on-success="onSuccess"
        :show-file-list="false"
      >
        <el-button type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <el-row :gutter="20" v-loading="loading">
      <el-col
        :span="4"
        style="margin-bottom:15px;"
        v-for="item in imgList"
        :key="item.id"
      >
        <el-card :body-style="{ padding: '0px' }">
          <div
            style="height:160px; display:flex; justify-content:center;align-items:center;"
          >
            <img
              style="max-width:100%;max-height:100%"
              :src="item.url"
              class="image"
            />
          </div>
          <div
            style="background-color:#f4f5f6; display:flex; justify-content:space-around;"
          >
            <el-tooltip
              :content="item.is_collected ? '取消收藏' : '收藏'"
              placement="top"
            >
              <el-button
                @click="doCollect(item)"
                type="text"
                :class="
                  item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'
                "
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                @click="doDel(item)"
                type="text"
                class="el-icon-delete"
              ></el-button>
            </el-tooltip>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="24"
      @current-change="pageChange"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
//导入本地token
import { getToken } from "../../../utils/token";

export default {
  name: "media",
  data() {
    return {
      radio1: "全部",
      imgList: [],
      total: 0,
      loading: true,
      headers: {
        Authorization: `Bearer ${JSON.parse(getToken()).token}`,
      },
    };
  },

  methods: {
    //封装获取图片素材
    loadData(page = 1) {
      this.$axios
        .get("/mp/v1_0/user/images", {
          params: {
            page,
            per_page: 24,
            collect: this.radio1 === "收藏",
          },
        })
        .then((res) => {
          this.imgList = res.data.data.results;
          this.total = res.data.data.total_count;
          this.loading = false;
        });
    },

    //点击跳转页面
    pageChange(page) {
      this.loadData(page);
    },

    // 菜单改变
    changeMenu() {
      this.loadData();
    },

    //点击收藏事件
    doCollect(item) {
      item.is_collected = !item.is_collected;
      this.$axios
        .put(`/mp/v1_0/user/images/${item.id}`, {
          collect: item.is_collected,
        })
        .then((res) => {
          this.$message.success("操作成功");
        });
    },

    //点击删除事件
    doDel(item) {
      this.$axios.delete(`/mp/v1_0/user/images/${item.id}`).then((res) => {
        this.loadData();
      });
    },

    //图片上传成功的函数
    onSuccess(response, file, fileList) {
      this.loadData();
    },
  },

  created() {
    //获取图片素材
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.box-card {
  .clearfix {
    display: flex;
    justify-content: space-between;
  }
}
</style>
