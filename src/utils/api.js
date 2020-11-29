//封装axios
import axios from 'axios';
const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,  // 1s
    // headers: {'X-Custom-Header': 'foobar'}
});
export default instance; 