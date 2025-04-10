'use client'

import { updatePassword } from '@/app/account/login/actions'
import { useActionState } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function UpdatePasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, {
    error: '',
    success: '',
  })

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
        <Link href="/account/login" className="text-sm text-yellow-500 flex">
          <ArrowLeftIcon className="md:w-5" />
          <span className="ml-1">Back to login</span>
        </Link>

        <h1 className="text-2xl font-semibold defaulttext mb-6 text-center mt-4">Set a new password</h1>

        <form className="space-y-5" action={formAction}>
          <div>
            <label htmlFor="password" className="text-sm defaulttext">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your new password..."
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
              <span className="loading loading-spinner mr-2"></span>
            ) : null}
            Update Password
          </button>
        </form>

        {errorMessage && (
          <div className="mt-6 bg-red-500 text-white text-sm p-3 rounded-lg shadow">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mt-6 bg-green-500 text-white text-sm p-3 rounded-lg shadow">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  )
}