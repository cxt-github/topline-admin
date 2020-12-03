<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix ">
      <div class="clearfix-text">
        <span>全部图文</span>
      </div>
      <el-form ref="form" label-width="80px" :model="searchParams">
        <el-form-item label="文章状态">
          <el-radio-group v-model="searchParams.status">
            <el-radio label="">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="3">审核通过</el-radio>
            <el-radio :label="4">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 封装的频道组件 -->
        <el-form-item label="频道列表">
          <!-- <ttchannel :channel_id="searchParams.channel_id" @change="searchParams.channel_id = $event"></ttchannel> -->
          <ttchannel v-model="searchParams.channel_id"></ttchannel>
        </el-form-item>

        <el-form-item label="时间选择">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="searchParams.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="doSearch">筛选</el-button>
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
          <el-tag>{{ scope.row.status | formatStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="doEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="doDel(scope.row)"
            >删除</el-button
          >
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
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
//导入封装的频道组件
import ttchannel from "../../../components/ttchannel";

export default {
  name: "articles",
  components: {
    ttchannel,
  },
  data() {
    return {
      searchParams: {
        status: "",
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
      this.loading = true;

      const status =
        this.searchParams.status === "" ? undefined : this.searchParams.status;
      const channel_id =
        this.searchParams.channel_id === ""
          ? undefined
          : this.searchParams.channel_id;
      const begin_pubdate =
        this.searchParams.date === null ? undefined : this.searchParams.date[0];
      const end_pubdate =
        this.searchParams.date === null ? undefined : this.searchParams.date[1];

      const res = await this.$axios.get("/mp/v1_0/articles", {
        params: {
          status,
          channel_id,
          begin_pubdate,
          end_pubdate,
          page: page,
        },
      });
      //   console.log(res);
      this.tableData = res.data.data.results;
      this.total = res.data.data.total_count;
      //停止加载动画
      this.loading = false;
    },

    //页面点击事件
    handleCurrentChange(page) {
      this.loadTableData(page);
    },

    //筛选点击事件
    doSearch() {
      this.loadTableData(1);
    },

    //删除点击事件
    doDel(row) {
      this.$confirm("此操作将永久删除?", "是否删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // this.$axios.delete(`/mp/v1_0/articles/${row.id}`)，发送请求误，删除不了
          this.$message({
            type: "warning",
            message: "删除失败!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //点击修改事件
    doEdit(row) {
      this.$router.push(`/publish/${row.id}`)
    }
  },

  created() {
    //获取表格数据的方法
    this.loadTableData(1);

    //获取频道列表数据
  },

  //过滤器
  filters: {
    //过滤状态
    formatStatus(val) {
      switch (val) {
        case 0:
          return "草稿";
        case 1:
          return "待审核";
        case 2:
          return "审核通过";
        case 3:
          return "审核失败";
        case 4:
          return "已删除";
      }
    },
  },
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
