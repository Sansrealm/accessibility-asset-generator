'use client'
import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import AssetGenerator from '../components/AssetGenerator'

export default function Home() {
  const { data: session } = useSession()

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Accessibility Asset Generator</h1>
          {!session ? (
            <button
              onClick={() => signIn('google')}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Sign In with Google
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <span>{session.user.email}</span>
              <button
                onClick={() => signOut()}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </div>
          )}
        </header>
        
        {session && <AssetGenerator />}
      </div>
    </main>
  )
}
