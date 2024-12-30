import { CreateInvoice } from '@/components/create-invoice'
import { requireUser } from '@/lib/hooks'

export default async function InvoiceCreationRoute() {
  const session = await requireUser()

  return <CreateInvoice user={session.user} />
}
