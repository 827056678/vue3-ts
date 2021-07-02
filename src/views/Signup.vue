<template>
  <div class="login-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">注册到者也</h5>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules"
          v-model="email"
          placeholder="请输入邮箱地址"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <validate-input
          :rules="nameRules"
          v-model="nickName"
          placeholder="请输入昵称"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          :rules="passwordRules"
          v-model="password"
          placeholder="请输入密码"
          type="password"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <validate-input
          :rules="repeatPasswordRules"
          v-model="repeatPassword"
          placeholder="请再次输入密码"
          type="password"
        />
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">
          注册
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from '../utils/http';
import { GlobalDataProps } from '../store';
import useCreateMessage from '../hooks/useCreateMessage';
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue';
import ValidateForm from '../components/ValidateForm.vue';

export default defineComponent({
  name: 'Signup',
  components: {
    ValidateInput,
    ValidateForm,
  },
  setup() {
    const router = useRouter();
    const store = useStore<GlobalDataProps>();
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' },
    ];
    const nameRules: RulesProp = [
      { type: 'required', message: '昵称不能为空' },
    ];
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' },
    ];
    const repeatPasswordRules: RulesProp = [
      { type: 'required', message: '重复密码不能为空' },
      {
        type: 'custom',
        validator: () => {
          return formData.password === formData.repeatPassword;
        },
        message: '两次密码不一致',
      },
    ];
    const formData = reactive({
      email: '',
      nickName: '',
      password: '',
      repeatPassword: '',
      onFormSubmit: (result: boolean) => {
        if (result) {
          const payload = {
            email: formData.email,
            nickName: formData.nickName,
            password: formData.password,
          };
          axios
            .post('/users', payload)
            .then(() => {
              useCreateMessage('注册成功,2秒后跳转登录', 'success');
              setTimeout(() => {
                router.push('/login');
              }, 2000);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      },
    });

    return {
      ...toRefs(formData),
      emailRules,
      nameRules,
      passwordRules,
      repeatPasswordRules,
    };
  },
});
</script>

<style></style>
