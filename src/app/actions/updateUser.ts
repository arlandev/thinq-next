'use server'

import { db } from '@/server/db'

export interface UpdateUserInput {
  id: number
  name: string
  email: string
}

export async function updateUser(input: UpdateUserInput) {
  const { id, name, email } = input

  try {
    const trimmedName = (name ?? '').trim()
    const [firstName, ...rest] = trimmedName.split(' ')
    const lastName = rest.join(' ').trim()

    const updated = await db.user.update({
      where: { id },
      data: {
        user_email: email,
        ...(firstName ? { user_firstname: firstName } : {}),
        ...(lastName ? { user_lastname: lastName } : {}),
      },
    })

    return { success: true, data: updated }
  } catch (error) {
    console.error('updateUser failed:', error)
    return { success: false, error: 'Failed to update user' }
  }
}


