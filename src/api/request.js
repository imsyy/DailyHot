import axios from "axios";

switch (process.env.NODE_ENV) {
  case "production":
    axios.defaults.baseURL = import.meta.env.VITE_GLOBAL_API;
    break;
  case "development":
    axios.defaults.baseURL = import.meta.env.VITE_GLOBAL_API;
    break;
  default:
    axios.defaults.baseURL = import.meta.env.VITE_GLOBAL_API;
    break;
}

axios.defaults.timeout = 30000;
axios.defaults.headers = { "Content-Type": "application/json" };

// 请求拦截
axios.interceptors.request.use(
  (request) => {
    // if (request.loadingBar != "Hidden") $loadingBar.start();
    const token = localStorage.getItem("token");
    if (token) {
      request.headers.Authorization = token;
    }
    return request;
  },
  (error) => {
    // $loadingBar.error();
    $message.error("请求失败，请稍后重试");
    return Promise.reject(error);
  }
);

// 响应拦截
axios.interceptors.response.use(
  (response) => {
    // $loadingBar.finish();
    return response.data;
  },
  (error) => {
    $loadingBar.error();
    if (error.response) {
      let data = error.response.data;
      switch (error.response.status) {
        case 401:
          $message.error(data.message ? data.message : "请登录后使用");
          break;
        case 301:
          $message.error(data.message ? data.message : "请求路径发生跳转");
          break;
        case 403:
          $message.error(data.message ? data.message : "暂无访问权限");
          break;
        case 404:
          $message.error(data.message ? data.message : "请求资源不存在");
          break;
        case 500:
          $message.error(data.message ? data.message : "内部服务器错误");
          break;
        default:
          $message.error(data.message ? data.message : "请求失败，请稍后重试");
          break;
      }
    } else {
      $message.error(data.message ? data.message : "请求失败，请稍后重试");
    }
    return Promise.reject(error);
  }
);

export default axios;
