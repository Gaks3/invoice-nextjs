'use client'

import {
  CheckCircleIcon,
  DownloadCloudIcon,
  MailIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import Link from 'next/link'
import { toast } from 'sonner'

export function InvoiceActions({ id }: { id: string }) {
  const handleSendReminder = () => {
    toast.promise(
      fetch(`/api/email/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      {
        loading: 'Sending reminder email...',
        success: 'Reminder email sent successfully',
        error: 'Failed to send reminder email',
      }
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={'icon'} variant={'secondary'}>
          <MoreHorizontalIcon className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <Link href={''}>
            <CheckCircleIcon className='size-4 mr-2' />
            Mark as Paid
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/invoices/${id}`}>
            <PencilIcon className='size-4 mr-2' />
            Edit Invoice
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/api/invoice/${id}`}>
            <DownloadCloudIcon className='size-4 mr-2' />
            Download Invoice
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendReminder}>
          <MailIcon className='size-4 mr-2' />
          Reminder Email
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={''} className='text-destructive'>
            <TrashIcon className='size-4 mr-2' />
            Delete Invoice
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
