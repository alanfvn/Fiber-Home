import axios from "axios";
import { get_token } from "./cookie-man";

const token = get_token()

const HttpMan = axios.create({
  baseURL: process.env.REACT_APP_REST,
  headers: { Authorization: token }
}) 

export default HttpMan
