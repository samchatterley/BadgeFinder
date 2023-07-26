import axios from "axios";
const logger = require("../../../logger");

/**
 * Base URL of the API server, fetched from environment variables or defaults to "http://localhost:5000"
 * @type {string}
 */
const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * An instance of axios with a base URL and default headers
 * @type {axios.AxiosInstance}
 */
const instance = axios.create({
  baseURL,
});

/**
 * Interceptor for the axios instance. It handles the response and any errors that occur during the request.
 * If a network error occurs, the request is retried once.
 */
instance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response) {
      // Use error level logging for server errors
      logger.error(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      logger.warn(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      logger.error('Error', error.message);
    }

    // Retry the request under certain conditions
    if (error.message.includes("Network Error") && !error.config.__isRetryRequest) {
      error.config.__isRetryRequest = true;
      try {
        const response = await instance(error.config);
        return response;
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;