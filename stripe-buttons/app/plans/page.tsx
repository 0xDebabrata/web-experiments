import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import Pricing from '@/components/Pricing'

export const dynamic = 'force-dynamic'

export default async function Plans() {
  const supabase = createServerComponentClient({ cookies })

  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  }
  const getActiveProductsWithPrices = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, prices(*)')
      .eq('active', true)
      .eq('prices.active', true)
      .order('metadata->index')
      .order('unit_amount', { foreignTable: 'prices' });

    if (error) {
      console.log(error.message);
    }
    return data ?? [];
  };
  async function getSubscription() {
    try {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*, prices(*, products(*))')
        .in('status', ['trialing', 'active'])
        .maybeSingle()
        .throwOnError();
      return subscription;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  const [session, products, subscription] = await Promise.all([getSession(), getActiveProductsWithPrices(), getSubscription()])

  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <div />
          <div>
            {session ? (
              <div className="flex items-center gap-4">
                Hey, {session.user.email}!
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
        <Pricing
          session={session}
          user={session?.user}
          products={products}
          subscription={subscription}
        />
      </div>
    </div>
  )
}
