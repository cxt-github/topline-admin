<template>
  <div>
    <el-form
      v-loading="isLoading"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="60px"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="内容">
        <quillEditor
          v-model="form.content"
          :options="editorOption"
        ></quillEditor>
      </el-form-item>

      <el-form-item label="封面">
        <el-radio-group v-model="form.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
        
        <el-row v-if="form.cover.type > 0">
          <el-col :span="5" v-for="item in form.cover.type" :key="item">
            <upimg @change="form.cover.images[item-1] = $event"></upimg>
          </el-col>
        </el-row>

      </el-form-item>

      <el-form-item label="频道">
        <ttchannel v-model="form.channel_id"></ttchannel>
      </el-form-item>

      <el-form-item>
        <el-button size="small">保存草稿</el-button>
        <el-button size="small" type="primary" @click="doPublish('form')">{{
          $route.params.id ? "修改" : "发布..."
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import upimg from './components/uploadimage'

import { quillEditor } from "vue-quill-editor";
import ttchannel from "../../../components/ttchannel";

export default {
  name: "publish",
  components: {
    quillEditor,
    ttchannel,
    upimg
  },
  data() {
    return {
      isLoading: true,
      form: {
        title: "",
        content: "",
        channel_id: "",
        cover:{
          type: 1,
          images: []
        }
      },

      oldForm: {},

      isSave: false,

      // 表单验证规则
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" },
          {
            min: 5,
            max: 30,
            message: "标题必须长度在5到30个字以内",
            trigger: "blur",
          },
        ],
      },

      // 富文本配置
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }], // text direction

            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],
            ["image"],
            ["clean"], // remove formatting button
          ],
        },
      },
    };
  },

  methods: {
    //发布点击事件
    doPublish(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.$route.name == "publish-edit") {
            //修改文章
            this.$message.warning("修改失败");
          } else {
            //新增文章
            // 发请求去做新增
            const res = await this.$axios.post("/mp/v1_0/articles", this.form);
            if (res.data.message.toLowerCase() == "ok") {
              this.$message.success("发布成功");
              this.isSave = true;
              this.$router.push("/article");
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //封装获取id文章数据
    async loadData() {
      //根据id获取文章数据
      const res = await this.$axios.get(
        `/mp/v1_0/articles/${this.$route.params.id}`
      );
      // console.log(res);   已查看，接口有误暂无数据
      this.form = res.data.data;
      this.oldForm = { ...this.from };
      this.isLoading = false;
    },
  },

  created() {
    //判断是否修改文章
    if (this.$route.name == "publish-edit") {
      this.loadData();
    } else {
      //新增就不需要加载中，直接就停掉
      this.isLoading = false;
    }
  },

  beforeRouteLeave(to, from, next) {
    //如果已经保存了可以直接放行
    if (this.isSave) return next();
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    if (this.$route.name == "publish-edit") {
      if (
        this.form.title == this.oldForm.title &&
        this.form.content == this.oldForm.content
      ) {
        return next();
      }
    } else {
      //新增判断是否为空
      if (this.form.title == "" && this.form.content == "") {
        return next();
      }
    }

    this.$confirm("您当前页有未保存内容, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        next();
      })
      .catch(() => {});
  },

  //监听器
  watch: {
    //监听id的变化,value是变化后的值
    "$route.params.id"(value) {
      if (value) {
        //有值，就是修改，只要把id变了，根据新id去发请求渲染页面
        this.loadData();
      } else {
        //如果value没值，代表新增，就清空界面
        this.from.title = "";
        this.from.content = "";
      }
    },
  },
};
</script>

<style lang="less">
/* 要改变富文本内容的高度，那么要给它自己生成的这个div加高度，否则布局有问题 */
.ql-editor {
  height: 400px;
}

</style>
