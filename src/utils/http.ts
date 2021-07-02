import axios from 'axios';
import store from '../store';

const iCode = 'E0931C616E63DCC6';
axios.defaults.baseURL = 'http://apis.imooc.com/api/';

// 请求拦截
axios.interceptors.request.use((config) => {
  // get 请求，添加到 url 中
  config.params = { ...config.params, icode: iCode };
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', iCode);
  } else {
    // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: iCode };
  }
  store.commit('setLoading', true);
  store.commit('setError', { status: false });
  return config;
});

// 响应拦截
axios.interceptors.response.use(
  (config) => {
    setTimeout(() => {
      store.commit('setLoading', false);
    }, 2000);
    return config;
  },
  (e) => {
    const { error } = e.response.data;
    store.commit('setError', { status: true, message: error });
    store.commit('setLoading', false);
    return Promise.reject(error);
  }
);
export default axios;
