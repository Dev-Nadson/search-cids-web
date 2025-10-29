import axios from "axios";
import { env } from "../config/env.config";

const connection = axios.create({
    baseURL: env.BASE_URL
})

export { connection }