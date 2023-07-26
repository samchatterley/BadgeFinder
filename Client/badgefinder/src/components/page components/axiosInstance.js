import axios from 'axios'
const logger = require('../../../logger')

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { post: { 'Content-Type': 'application/json' } }
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      logger.info(error.response.data)
    } else {
      logger.info(error.message)
    }
    return Promise.reject(error)
  }
)

export default instance
