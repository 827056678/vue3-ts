<template>
  <div class="create-post-page">
    <h4>{{ isEditMode ? '编辑文章' : '新建文章' }}</h4>
    <uploader
      action="/upload"
      class="
        d-flex
        align-items-center
        justify-content-center
        bg-light
        text-secondary
        w-100
        my-4
      "
      :beforeUpload="uploadCheck"
      :uploaded="uploadedData"
      @file-uploaded="handleFileUploaded"
    >
      <h2>点击上传</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url" alt="" />
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          rows="10"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">
          {{ isEditMode ? '编辑文章' : '新建文章' }}
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store';
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue';
import ValidateForm from '../components/ValidateForm.vue';
import Uploader from '../components/Uploader.vue';
import { beforeUploadCheck } from '../utils/helper';
import useCreateMessage from '../hooks/useCreateMessage';
export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore<GlobalDataProps>();
    let imageId = '';
    const titleVal = ref('');
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' },
    ];
    const contentVal = ref('');
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' },
    ];
    const uploadedData = ref();
    const isEditMode = !!route.query.id;
    onMounted(() => {
      if (isEditMode) {
        store
          .dispatch('fetchPost', route.query.id)
          .then((rawData: ResponseType<PostProps>) => {
            const currentPost = rawData.data;
            if (currentPost.image) {
              uploadedData.value = { data: currentPost.image };
            }
            titleVal.value = currentPost.title;
            contentVal.value = currentPost.content || '';
          });
      }
    });

    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, {
        format: ['image/jpeg', 'image/png'],
        size: 1,
      });
      const { passed, error } = result;
      if (error === 'format') {
        useCreateMessage('上传图片只能是 JPG/PNG 格式', 'error');
      }
      if (error === 'size') {
        useCreateMessage('上传图片大小不能超过 1Mb', 'error');
      }
      return passed;
    };

    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id;
      }
    };

    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = store.state.user;
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id,
          };
          if (imageId) {
            newPost.image = imageId;
          }
          const actionName = isEditMode ? 'updatePost' : 'createPost';
          const sendData = isEditMode
            ? {
                id: route.query.id,
                payload: newPost,
              }
            : newPost;
          store.dispatch(actionName, sendData).then(() => {
            useCreateMessage(
              isEditMode
                ? '编辑成功，2秒后跳转到文章列表页面'
                : '发表成功，2秒后跳转到文章列表页面',
              'success'
            );
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } });
            }, 2000);
          });
        }
      }
    };

    return {
      titleVal,
      titleRules,
      contentVal,
      contentRules,
      onFormSubmit,
      uploadCheck,
      handleFileUploaded,
      uploadedData,
      isEditMode,
    };
  },
});
</script>
<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
