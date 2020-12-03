<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="60px">
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
        <ttchannel></ttchannel>
      </el-form-item>

      <el-form-item>
        <el-button size="small">保存草稿</el-button>
        <el-button size="small" type="primary" @click="doPublish('form')"
          >发布...</el-button
        >
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
      form: {
        title: "",
        content: "",
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
          // 发请求去做新增
         const res = await this.$axios
            .post("/mp/v1_0/articles", {
              title: this.form.title,
              content: this.form.content,
              cover: {
                type: 1,
                images: ["http://toutiao-img.itheima.net/FgdUAhfFRH35OawIKa-LxNWxJ8bG"]
              },
              channel_id: 2,
            })
          if(res.data.message.toLowerCase() == "ok"){
            this.$message.success('发布成功')
            this.$router.psuh('./article')
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style>
/* 要改变富文本内容的高度，那么要给它自己生成的这个div加高度，否则布局有问题 */
.ql-editor {
  height: 400px;
}
</style>
