<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix ">
      <div class="clearfix-text">
        <span>全部图文</span>
      </div>
      <el-form ref="form" label-width="80px" :model="searchParams">
        <el-form-item label="文章状态">
          <el-radio-group v-model="searchParams.status">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="2">草稿</el-radio>
            <el-radio :label="3">待审核</el-radio>
            <el-radio :label="4">审核通过</el-radio>
            <el-radio :label="5">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道列表">
          <el-select placeholder="请选择" v-model="searchParams.channel_id">
            <el-option label="所有频道" value=""></el-option>
            <el-option label="区域二" value="two"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间选择">
          <el-date-picker
            v-model="searchParams.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <p>
      共找到 <b>{{ total }}</b
      >条符合条件的内容
    </p>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="cover.images[0]" label="封面" width="150">
        <template slot-scope="scope">
          <img width="50" :src="scope.row.cover.images[0]" alt />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" width="180">
          <template slot-scope="scope">
               <el-tag>{{scope.row.status | formatStatus}}</el-tag>
          </template>
      </el-table-column>
      <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small">修改</el-button>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

     <el-pagination
      background
      :disabled="loading"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "articles",
  data() {
    return {
      searchParams: {
        status: 1,
        channel_id: "",
        date: "",
      },
      tableData: [],
      total: 0, //总台数
      loading: false,
    };
  },

  methods: {
    // 封装的获取表格数据的方法
    async loadTableData(page) {
      //加载动画
      this.loading = true
      const res = await this.$axios.get("/mp/v1_0/articles",{
          params:{
              page:page
          }
      });
    //   console.log(res);
      this.tableData = res.data.data.results;
      this.total = res.data.data.total_count;
      //停止加载动画
      this.loading = false
    },

    //页面点击事件
    handleCurrentChange(page) {
        this.loadTableData(page)
    }
  },

  created() {
      //获取表格数据的方法
      this.loadTableData(1)
  },

  //过滤器
  filters:{
      //过滤状态
      formatStatus(val){
          switch (val) {
              case 0:
                return '草稿';
              case 1:
                return '待审核'
              case 2:
                return '审核通过'
              case 3:
                return '审核失败'
              case 4:
                return '已删除'
          }
      }
  }
};
</script>

<style lang="less" scoped>
.box-card {
  .clearfix {
    padding: 0;
    .clearfix-text {
      border-bottom: 1px dashed #ccc;
      margin: 0 5px;
      padding: 0 10px;
      font-size: 14px;
      height: 55px;
      line-height: 55px;
      color: #323745;
    }
  }
}
</style>
