import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import PaidGif from '@/public/paid-gif.gif'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { MarkAsPaidAction } from '@/app/actions'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { requireUser } from '@/lib/hooks'
import SubmitButton from '@/components/submit-button'

async function Authorize(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
  })

  if (!data) {
    return redirect('/dashboard/invoices')
  }
}

type Params = Promise<{ id: string }>

export default async function MarkAsPaid({ params }: { params: Params }) {
  const { id } = await params
  const session = await requireUser()
  await Authorize(id, session.user?.id as string)
  return (
    <div className='flex flex-1 justify-center items-center'>
      <Card className='max-w-[500px]'>
        <CardHeader>
          <CardTitle>Mark as Paid?</CardTitle>
          <CardDescription>
            Are you sure you want to mark this invoice as paid?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image src={PaidGif} alt='Paid Gif' className='rounded-lg' />
        </CardContent>
        <CardFooter className='flex items-center justify-between'>
          <Link
            className={buttonVariants({ variant: 'outline' })}
            href='/dashboard/invoices'
          >
            Cancel
          </Link>
          <form
            action={async () => {
              'use server'
              await MarkAsPaidAction(id)
            }}
          >
            <SubmitButton text='Mark as Paid!' />
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
