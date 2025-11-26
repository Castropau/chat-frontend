'use server'

import { cookies } from 'next/headers'

export async function deleteCookies(key: string) {
  (await cookies()).delete(key)
}
