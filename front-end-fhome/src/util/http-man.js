import axios from "axios";
import { get_token } from "./cookie-man";

const token = get_token()

const HttpMan = axios.create({
  baseURL: "http://192.168.0.100:3001", 
  headers: { Authorization: token }
}) 

export default HttpMan
