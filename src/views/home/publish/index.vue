<template>
  <div>
    <el-form v-loading="isLoading" ref="form" :rules="rules" :model="form" label-width="60px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="内容">
        <quillEditor
          v-model="form.content"
          :options="editorOption"
        ></quillEditor>
      </el-form-item>

      <el-form-item label="封面"></el-form-item>

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

import { quillEditor } from "vue-quill-editor";
import ttchannel from "../../../components/ttchannel";

export default {
  name: "publish",
  components: {
    quillEditor,
    ttchannel,
  },
  data() {
    return {
      isLoading: true,
      form: {
        title: "",
        content: "",
        channel_id: "",
      },

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
            const res = await this.$axios.post("/mp/v1_0/articles", {
              title: this.form.title,
              content: this.form.content,
              cover: {
                type: 1,
                images: [
                  "http://toutiao-img.itheima.net/FgdUAhfFRH35OawIKa-LxNWxJ8bG",
                ],
              },
              channel_id: this.form.channel_id,
            });
            if (res.data.message.toLowerCase() == "ok") {
              this.$message.success("发布成功");
              this.$router.push("/article");
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },

  async created() {
    //判断是否修改文章
    if (this.$route.name == "publish-edit") {
      //根据id获取文章数据
      const res = await this.$axios.get(
        `/mp/v1_0/articles/${this.$route.params.id}`
      );
      // console.log(res);   已查看，接口有误暂无数据
      this.form = res.data.data;
      this.isLoading = false
    } else {
      //新增就不需要加载中，直接就停掉
      this.isLoading = false;
    }
  },
};
</script>

<style>
/* 要改变富文本内容的高度，那么要给它自己生成的这个div加高度，否则布局有问题 */
.ql-editor {
  height: 400px;
}
</style>