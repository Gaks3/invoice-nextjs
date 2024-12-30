import prisma from '@/lib/db'
import { requireUser } from '@/lib/hooks'
import { emailClient } from '@/lib/mailtrap'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>
  }
) {
  try {
    const session = await requireUser()

    const { invoiceId } = await params

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    })

    if (!invoiceData) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    const sender = {
      email: 'invoice@adebagas.my.id',
      name: invoiceData.fromName,
    }

    emailClient.send({
      from: sender,
      to: [{ email: invoiceData.clientEmail }],
      template_uuid: '5d76772a-9e5f-4c99-a16d-5472b1c20308',
      template_variables: {
        first_name: invoiceData.clientName,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to send Email reminder' },
      { status: 500 }
    )
  }
}
