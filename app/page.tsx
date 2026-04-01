'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { PlusIcon, SignOutIcon } from '@phosphor-icons/react'

export default function Home() {
  const supabase = createClient()
  const router = useRouter()

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    }
  })

  // Example data fetch from a hypothetical "notes" table
  const { data: notes, isLoading: notesLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error && error.code !== 'PGRST116') { // Ignore table not found
         console.warn("Notes table might not exist yet:", error.message)
         return []
      }
      return data || []
    },
    enabled: !!user
  })

  const signout = async () => {
    await supabase.auth.signOut()
    router.refresh() // Trigger middleware redirect
  }

  if (userLoading) return <div className="flex h-screen items-center justify-center font-mono">Verifying session...</div>

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/10 dark:bg-black/80 p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Pocket Note</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500 hidden sm:block">{user?.email}</span>
            <button 
              onClick={signout}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors dark:hover:bg-white/10"
              title="Sign out"
            >
              <SignOutIcon size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">All Notes</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-950 text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors">
              <PlusIcon weight="bold" />
              New Note
            </button>
          </div>

          {notesLoading ? (
            <div className="text-zinc-500">Loading notes...</div>
          ) : notes && notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note: any) => (
                <div key={note.id} className="p-4 bg-white border border-zinc-200 rounded-xl hover:shadow-sm transition-shadow dark:bg-zinc-900 dark:border-white/10">
                  <h3 className="font-semibold text-zinc-900 dark:text-white">{note.title}</h3>
                  <p className="text-sm text-zinc-500 mt-2 line-clamp-3">{note.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 dark:bg-white/5">
                <PlusIcon size={32} className="text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white">No notes yet</h3>
              <p className="text-zinc-500 mt-1">Start by creating your first note.</p>
              <button className="mt-4 text-zinc-950 font-semibold hover:underline dark:text-white">Go to Supabase Dashboard to create a 'notes' table</button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
