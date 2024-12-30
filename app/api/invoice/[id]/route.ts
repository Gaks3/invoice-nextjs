import { NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import prisma from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import { notFound } from 'next/navigation'

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }
) {
  const { id } = await params

  const data = await prisma.invoice.findUnique({
    where: {
      id,
    },
  })

  if (!data) {
    return notFound()
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  pdf.setFont('helvetica')

  pdf.setFontSize(24)
  pdf.text(data.invoiceName, 20, 20)

  pdf.setFontSize(12)
  pdf.text('From', 20, 40)
  pdf.setFontSize(10)
  pdf.text([data.fromName, data.fromEmail, data.fromAddress], 20, 45)

  pdf.setFontSize(12)
  pdf.text('Bill to', 20, 70)
  pdf.setFontSize(10)
  pdf.text([data.clientName, data.clientEmail, data.clientAddress], 20, 75)

  pdf.setFontSize(10)
  pdf.text(`Invoice Number: #${data.id}`, 100, 40)
  pdf.text(
    `Date: ${new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
    }).format(data.date)}`,
    100,
    45
  )
  pdf.text(`Due Date: Net ${data.dueDate}`, 100, 50)

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Description', 20, 100)
  pdf.text('Quantity', 100, 100)
  pdf.text('Rate', 130, 100)
  pdf.text('Total', 160, 100)

  pdf.line(20, 102, 190, 102)

  pdf.setFont('helvetica', 'normal')
  pdf.text(data.invoiceItemDescription, 20, 110)
  pdf.text(data.invoiceItemQuantity.toString(), 100, 110)
  pdf.text(formatCurrency(data.invoiceItemRate, data.currency), 130, 110)
  pdf.text(formatCurrency(data.total, data.currency), 160, 110)

  pdf.line(20, 115, 190, 115)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`Total (${data.currency})`, 130, 130)
  pdf.text(formatCurrency(data.total, data.currency), 160, 130)

  if (data.note) {
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.text('Note:', 20, 150)
    pdf.text(data.note, 20, 155)
  }

  const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
    },
  })
}
