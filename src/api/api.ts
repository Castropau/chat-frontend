import axios from "axios";
import { getCookies } from "@/server/getToken";
// import dayjs from "dayjs";

export const api = axios.create({
  baseURL: process.env.baseUrl, // Replace with actual fallback or use env
})

api.interceptors.request.use(async (config) => {
    const token = await getCookies('token');
    // const createdAt = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    
    config.headers.Authorization = `Bearer ${token?.value}`
    // config.headers['API-KEY'] = process.env.apiKey
    // config.headers['CREATED-AT'] = createdAt

    return config
})