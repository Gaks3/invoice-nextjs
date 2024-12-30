'use server'

import prisma from '@/lib/db'
import { requireUser } from '@/lib/hooks'
import { onboardingSchema } from '@/lib/zod-schemas'
import { parseWithZod } from '@conform-to/zod'
import { redirect } from 'next/navigation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
