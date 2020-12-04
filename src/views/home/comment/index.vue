<template>
  <div>
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="标题" width="600"> </el-table-column>
      <el-table-column prop="comment_status" label="评论状态" width="180">
        <template slot-scope="scope">
          {{ scope.row.comment_status ? "正常" : "关闭" }}
        </template>
      </el-table-column>
      <el-table-column prop="total_comment_count" label="总评论数">
      </el-table-column>
      <el-table-column prop="fans_comment_count" label="粉丝评论数">
      </el-table-column>
      <el-table-column label="允许评论">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="turn(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain>修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :disabled="loading"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "comment",
  data() {
    return {
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 10,
      loading: true,
    };
  },

  methods: {
    //封装获取评论数据
    async commentData(page) {
      const res = await this.$axios.get("/mp/v1_0/articles", {
        params: {
          page: this.page,
          per_page: this.pageSize,
          response_type: "comment",
        },
      });
      this.tableData = res.data.data.results;
      this.total = res.data.data.total_count;
      this.loading = false;
    },
    //页码改变的事件
    handleCurrentChange(page) {
      this.page = page;
      this.commentData();
    },

    //页容量改变的事件row
    handleSizeChange(val) {
      this.pageSize = val;
      this.commentData();
    },

    //文章状态改变事件
    turn(row) {
      this.$axios.put(
        `/mp/v1_0/comments/status?article_id=${row.id}`,{
            allow_comment: row.comment_status,
        }
      ).then(res => {
          //接口有误，修改不了
      })
      .catch(error => {
          if(error.response.status == 400){
              this.$message.warning('修改失败')
          }
      })
    },
  },

  created() {
    //获取评论数据
    this.commentData();
  },
};
</script>

<style></style>
