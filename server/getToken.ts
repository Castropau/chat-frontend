"use server";
import { cookies } from "next/headers"

export async function getCookies(key: string){
    return (await cookies()).get(key)
}