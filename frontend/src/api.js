import axios from 'axios'
 


const API = axios.create({
    // baseURL : 'http://localhost:5000/api',
    baseURL : 'https://sidzzle-backend.onrender.com/api'
})

export default API