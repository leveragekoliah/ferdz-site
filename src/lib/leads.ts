// Lead capture for the gated business portals (/barber, /collabs, /credit, /trading, /cutlist).
// Saves to the `leads` table in the Lovable Cloud (Supabase) database via its REST API, using the
// project URL + publishable key that Lovable Cloud puts in the environment. The table only allows
// anonymous INSERT (see supabase/migrations/*_leads.sql), so the site can add leads but never read them.

export type Lead = {
  business: string
  fullName: string
  phone: string
  email: string
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY) as
  | string
  | undefined

export const leadsConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY)

export async function submitLead(lead: Lead): Promise<void> {
  if (!leadsConfigured) {
    // Local development has no database. Say so instead of pretending the lead was saved.
    if (import.meta.env.DEV) {
      console.info('[leads] DEV ONLY — no database configured, lead NOT saved:', lead.business)
      return
    }
    throw new Error('Sign-up is not connected yet. Please try again later.')
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      business: lead.business,
      full_name: lead.fullName,
      phone: lead.phone,
      email: lead.email,
      source_path: typeof window !== 'undefined' ? window.location.pathname : null,
    }),
  })
  if (!res.ok) throw new Error('Something went wrong saving your details. Please try again.')
}
