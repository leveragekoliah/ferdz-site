import { Navigate } from 'react-router-dom'
import { getBusiness } from '../data'
import LeadGate from '../components/LeadGate'
import BusinessPage from './BusinessPage'

/** Gated standalone portal for one business: entry form first, then the full business page. */
export default function PortalPage({ slug }: { slug: string }) {
  const b = getBusiness(slug)
  if (!b) return <Navigate to="/businesses" replace />
  return (
    <LeadGate key={slug} business={slug} businessName={b.name} tagline={b.tagline}>
      <BusinessPage slug={slug} />
    </LeadGate>
  )
}
