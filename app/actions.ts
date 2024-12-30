/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import prisma from '@/lib/db'
import { requireUser } from '@/lib/hooks'
import { emailClient } from '@/lib/mailtrap'
import { formatCurrency } from '@/lib/utils'
import { invoiceSchema, onboardingSchema } from '@/lib/zod-schemas'
import { parseWithZod } from '@conform-to/zod'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function onboardUser(prevState: any, formData: FormData) {
  const session = await requireUser()

  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  await prisma.user.update({
    where: {
      id: session.user!.id,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
    },
  })

  return redirect('/dashboard')
}

export async function createInvoice(prevState: any, formData: FormData) {
  const session = await requireUser()

  const headerList = await headers()
  const currentUrl = headerList.get('x-current-url')

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const invoice = await prisma.invoice.create({
    data: {
      ...submission.value,
      userId: session.user.id,
    },
  })

  const sender = {
    email: 'invoice@adebagas.my.id',
    name: submission.value.fromName,
  }

  const dueDate = invoice.date
  dueDate.setDate(dueDate.getDate() + invoice.dueDate)

  emailClient.send({
    from: sender,
    to: [
      {
        email: submission.value.clientEmail,
        name: submission.value.clientName,
      },
    ],
    template_uuid: '75984d64-90aa-4c68-95ff-17cb524244a6',
    template_variables: {
      clientName: invoice.clientName,
      invoiceNumber: invoice.id,
      dueDate: new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
      }).format(dueDate),
      totalAmount: formatCurrency(invoice.total, invoice.currency),
      invoiceLink: `${currentUrl}/api/invoice/${invoice.id}`,
    },
    category: 'Invoice test',
  })

  return redirect('/dashboard/invoices')
}

export async function editInvoice(prevState: any, formData: FormData) {
  await requireUser()

  const headerList = await headers()
  const currentUrl = headerList.get('x-current-url')

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const invoice = await prisma.invoice.update({
    where: {
      id: formData.get('id') as string,
    },
    data: {
      ...submission.value,
    },
  })

  const sender = {
    email: 'invoice@adebagas.my.id',
    name: invoice.fromName,
  }

  const dueDate = invoice.date
  dueDate.setDate(dueDate.getDate() + invoice.dueDate)

  emailClient.send({
    from: sender,
    to: [
      {
        email: submission.value.clientEmail,
        name: submission.value.clientName,
      },
    ],
    template_uuid: '75984d64-90aa-4c68-95ff-17cb524244a6',
    template_variables: {
      clientName: invoice.clientName,
      invoiceNumber: invoice.id,
      dueDate: new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
      }).format(dueDate),
      totalAmount: formatCurrency(invoice.total, invoice.currency),
      invoiceLink: `${currentUrl}/api/invoice/${invoice.id}`,
    },
    category: 'Invoice test',
  })

  return redirect('/dashboard/invoices')
}
