'use client'

import { useFormStatus } from 'react-dom'
import { Button } from './ui/button'
import { Loader2Icon } from 'lucide-react'

export default function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type='submit' className='w-full' disabled={pending}>
      {pending ? (
        <>
          <Loader2Icon className='size-4 mr-2 animate-spin' /> Please wait...
        </>
      ) : (
        'Submit'
      )}
    </Button>
  )
}
