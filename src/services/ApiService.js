import axios from "axios";
import { responseHandler } from "./ApiResponseHandler";
import { useAuthStore } from "@/stores/authStore";

// Get the store instance directly (without hook)
const authStore = useAuthStore.getState();

const backendApiUrl = import.meta.env.VITE_API_URI;

export default class ApiService {
  api;

  _initApi(baseURL) {
    this.api = axios.create({
      baseURL: baseURL || backendApiUrl,
      validateStatus: (status) => {
        return status >= 200 && status < 300;
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  constructor(baseURL) {
    if (baseURL) this._initApi(baseURL);
    else this._initApi(backendApiUrl);
  }

  /**
   * GET request
   * @param {string} url
   * @param {Object} config
   */
  async get(url, config = {}) {
    console.log('[ApiService] GET request called:', url);
    console.log('[ApiService] Current headers:', this.api.defaults.headers.common);
    return await responseHandler(
      this.api({
        ...config,
        url,
        method: "get",
      })
    );
  }

  /**
   * POST request
   * @param {string} url
   * @param {Object} data
   * @param {Object} config
   */
  async post(url, data, config = {}) {
    return await responseHandler(
      this.api({
        ...config,
        url,
        data,
        method: "post",
      })
    );
  }

  /**
   * PUT request
   */
  async put(url, data, config = {}) {
    return await responseHandler(
      this.api({
        ...config,
        url,
        data,
        method: "put",
      })
    );
  }

  /**
   * PATCH request
   */
  async patch(url, data, config = {}) {
    return await responseHandler(
      this.api({
        ...config,
        url,
        data,
        method: "patch",
      })
    );
  }

  /**
   * DELETE request
   */
  async delete(url, config = {}) {
    return await responseHandler(
      this.api({
        ...config,
        url,
        method: "delete",
      })
    );
  }

  /**
   * Add Authorization Bearer token
   */
  addAuthenticationHeader() {
    console.log('[ApiService] addAuthenticationHeader() called');
    try {
      // Get current state from the store (without using hook)
      const currentState = useAuthStore.getState();
      console.log('[ApiService] Auth store retrieved:', currentState);
      console.log('[ApiService] Auth data:', currentState.auth);
      
      const token = currentState.auth?.accessToken;
      console.log('[ApiService] Token:', token ? 'Present' : 'Missing');
      
      if (token) {
        this.api.defaults.headers.common.Authorization = `Bearer ${token}`;
        console.log('[ApiService] Authorization header set:', this.api.defaults.headers.common.Authorization);
      } else {
        console.warn('[ApiService] No token available, header not set');
      }
    } catch (error) {
      console.error('[ApiService] Error in addAuthenticationHeader:', error);
    }
    return this;
  }
}
