import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class Paystack {
  key: string;
  instance: AxiosInstance;
  constructor(key: string) {
    this.key = key;
    this.instance = this.axiosInstance();
  }

  axiosInstance() {
    const instance = axios.create({
      baseURL: "api.paystack.co",
      timeout: 1000,
      headers: {
        Authorization: `Bearer ${this.key}`,
        "Content-Type": "application/json",
      },
    });
    return instance;
  }
  async initialize() {
    const config: AxiosRequestConfig = {};
    const init = await this.instance.post("/transaction/initialize");
  }
}
