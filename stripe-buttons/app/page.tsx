import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LogoutButton from '../components/LogoutButton'
import SupabaseLogo from '../components/SupabaseLogo'
import NextJsLogo from '../components/NextJsLogo'

export const dynamic = 'force-dynamic'

export default async function Index() {
  const supabase = createServerComponentClient({ cookies })

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  }

  const getSubscription = async () => {
    const { data, error } = await supabase.from('subscriptions').select('*')
    if (error) {
      console.error(error)
    }
    return data ?? []
  }

  const [user, subscriptions] = await Promise.all([getUser(), getSubscription()])

  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <div />
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                Hey, {user.email}!
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/login"
                className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
        <div className="flex flex-col items-center mb-4 lg:mb-12">
          <div className="flex gap-8 justify-center items-center">
            <Link href="https://supabase.com/" target="_blank">
              <SupabaseLogo />
            </Link>
            <span className="border-l rotate-45 h-6" />
            <NextJsLogo />
          </div>
          <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
          <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
            The fastest way to start building apps with{' '}
            <strong>Supabase</strong> and <strong>Next.js</strong>
          </p>
          {subscriptions.length === 0 && (
            <Link 
              href="/plans"
              className="bg-foreground py-3 px-6 rounded-lg font-mono text-sm text-background">
              View plans
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}
