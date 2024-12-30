import { EditInvoice } from '@/components/edit-invoice'
import prisma from '@/lib/db'
import { requireUser } from '@/lib/hooks'
import { notFound } from 'next/navigation'

async function getData(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
  })

  if (!data) {
    return notFound()
  }

  return data
}

type Params = Promise<{ id: string }>

export default async function EditInvoiceRoute({ params }: { params: Params }) {
  const { id } = await params
  const session = await requireUser()
  const data = await getData(id, session.user?.id as string)

  return <EditInvoice data={data} />
}
