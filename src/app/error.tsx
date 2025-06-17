'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error capturado por error.tsx:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center flex-col text-center">
      <h1 className="text-3xl font-bold">Algo salió mal</h1>
      <p className="mt-2 text-gray-600">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Reintentar
      </button>
    </div>
  )
}
