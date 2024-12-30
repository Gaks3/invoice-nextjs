import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import WarningGif from '@/public/warning-gif.gif'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { DeleteInvoice } from '@/app/actions'
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

export default async function DeleteInvoiceRoute({
  params,
}: {
  params: Params
}) {
  const session = await requireUser()
  const { id } = await params
  await Authorize(id, session.user?.id as string)
  return (
    <div className='flex flex-1 justify-center items-center'>
      <Card className='max-w-[500px]'>
        <CardHeader>
          <CardTitle>Delete Invoice</CardTitle>
          <CardDescription>
            Are you sure that you want to delete this invoice?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image src={WarningGif} alt='Warning Gif' className='rounded-lg' />
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
              await DeleteInvoice(id)
            }}
          >
            <SubmitButton text='Delete Invoice' variant={'destructive'} />
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
