import axios, { type AxiosRequestConfig } from "axios";

interface RequestOptions extends AxiosRequestConfig {
  token?: string;
  contentType?: string;
}

const request = (options: RequestOptions = {}) => {

  const opts: RequestOptions = Object.assign({}, options, {
    headers: {
      "Content-Type": options?.contentType ? options?.contentType : "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${options.token}`,
    }
  });

  const baseUrl = import.meta.env.VITE_API_URL;

  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 120000,
    ...opts,
  });

  //Token refresh logic
  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (error.code === "ERR_NETWORK" && !originalRequest._retry) {
        originalRequest._retry = true;
        const response = await axios.post(`${baseUrl}/api/Auth/RefreshToken`, {
          accessToken: options.token,
          refreshToken: localStorage.getItem('refreshToken'),
        });
        if (response && response.status === 200) {
          originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
          return axiosInstance(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default request;