'use server'

import { revalidatePath } from 'next/cache'
import {createClient } from '@/utils/supabase/server'
import { userExists } from '@/utils/supabase/queries'

export async function login(_: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { error: 'Invalid input', success: false }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message, success: false }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signup(_: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')

  const user = await userExists( email);

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { error: 'Invalid input', success: false }
  }else if(user){
    return { error: 'Account already exists with this email', success: false }
  }

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error: error.message, success: false }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
type ActionState = {
  success: string
  error: string
}

export const sendResetPasswordEmail = async (
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const supabase = await createClient()

  const email = formData.get('email')
  if (typeof email !== 'string') {
    return {
      success: '',
      error: 'Invalid email',
    }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    console.log('error', error)
    return {
      success: '',
      error: error.message,
    }
  }

  return {
    success: 'Please check your email',
    error: '',
  }
}

export const updatePassword = async (
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const supabase = await createClient()

  const password = formData.get('password')
  if (typeof password !== 'string') {
    return {
      success: '',
      error: 'Invalid password',
    }
  }

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    console.log('error', error)
    return {
      success: '',
      error: error.message,
    }
  }

  return {
    success: 'Password updated',
    error: '',
  }
}
