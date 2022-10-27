import axios from "axios";

const HttpMan = axios.create({baseURL: "http://192.168.0.100:3002/api"}) 

export default HttpMan
