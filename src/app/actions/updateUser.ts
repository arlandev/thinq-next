'use server'

import { db } from '@/server/db'

export interface UpdateUserInput {
  id: number
  firstname: string
  lastname: string
  email: string
}

export async function updateUser(input: UpdateUserInput) {
  const { id, firstname, lastname, email } = input

  try {
    const updated = await db.user.update({
      where: { id },
      data: {
        user_email: email,
        user_firstname: firstname,
        user_lastname: lastname,
      },
    })

    return { success: true, data: updated }
  } catch (error) {
    console.error('updateUser failed:', error)
    return { success: false, error: 'Failed to update user' }
  }
}


