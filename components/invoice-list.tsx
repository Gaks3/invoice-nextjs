import prisma from '@/lib/db'
import { InvoiceActions } from './invoice-actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { requireUser } from '@/lib/hooks'
import { formatCurrency } from '@/lib/utils'
import { Badge } from './ui/badge'

export async function getData(userId: string) {
  return await prisma.invoice.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      clientName: true,
      total: true,
      createdAt: true,
      invoiceNumber: true,
      currency: true,
      status: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function InvoiceList() {
  const session = await requireUser()
  const data = await getData(session.user.id!)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className='text-right'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>#{invoice.id}</TableCell>
            <TableCell>{invoice.clientName}</TableCell>
            <TableCell>
              {formatCurrency(invoice.total, invoice.currency)}
            </TableCell>
            <TableCell>
              <Badge>{invoice.status}</Badge>
            </TableCell>
            <TableCell>
              {new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
              }).format(invoice.createdAt)}
            </TableCell>
            <TableCell className='text-right'>
              <InvoiceActions />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
