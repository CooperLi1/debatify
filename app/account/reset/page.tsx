'use client'

import { sendResetPasswordEmail } from '@/app/account/login/actions'
import { useActionState } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    sendResetPasswordEmail,
    {
      error: '',
      success: '',
    }
  )

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (state.error) {
      setErrorMessage(state.error)
      setSuccessMessage(null)
    } else if (state.success) {
      setSuccessMessage(state.success)
      setErrorMessage(null)
    }
  }, [state])

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="textbox p-8 w-full max-w-md">
        <Link href='/account/login' className='text-sm text-yellow-500 flex'>
          <ArrowLeftIcon className="md:w-5" />
          <span className='ml-1'>Back to login</span>
        </Link>

        <h1 className="text-2xl font-semibold defaulttext mb-6 text-center mt-3">Forgot password?</h1>

        <form className="space-y-5" action={formAction}>
          <div>
            <label htmlFor="email" className="text-sm defaulttext">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder='Enter your email...'
              required
              className="w-full inputfield mt-4 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full submitbutton"
          >
            {isPending ? (
              <span className='loading loading-spinner mr-2'></span>
            ) : null}
            Send Reset Link
          </button>
        </form>

        {errorMessage && (
          <div className="mt-6 bg-red-500 text-white text-sm p-3 rounded-lg shadow">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mt-6 bg-blue-500 text-white text-sm p-3 rounded-lg shadow">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  )
}
