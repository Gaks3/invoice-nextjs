'use client'

import SubmitButton from '@/components/submit-button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionState } from 'react'
import { onboardUser } from '../actions'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { onboardingSchema } from '@/lib/zod-schemas'

export default function Onboarding() {
  const [lastResult, action] = useActionState(onboardUser, undefined)
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: onboardingSchema,
      })
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  })

  return (
    <div className='min-h-screen w-screen flex items-center justify-center'>
      <Card className='max-w-sm mx-auto'>
        <CardHeader>
          <CardTitle className='text-xl'>You are almost finished!</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className='space-y-2'
            action={action}
            id={form.id}
            onSubmit={form.onSubmit}
            noValidate
          >
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor={fields.firstName.name}>First Name</Label>
                <Input
                  placeholder='John'
                  name={fields.firstName.name}
                  key={fields.firstName.key}
                  defaultValue={fields.firstName.initialValue}
                />
                <p className='text-destructive text-sm'>
                  {fields.firstName.errors}
                </p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor={fields.lastName.name}>Last Name</Label>
                <Input
                  placeholder='Doe'
                  name={fields.lastName.name}
                  key={fields.firstName.key}
                  defaultValue={fields.firstName.initialValue}
                />
                <p className='text-destructive text-sm'>
                  {fields.firstName.errors}
                </p>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor={fields.address.name}>Address</Label>
              <Input
                placeholder='Chad street 123'
                name={fields.address.name}
                key={fields.firstName.key}
                defaultValue={fields.firstName.initialValue}
              />
              <p className='text-destructive text-sm'>
                {fields.firstName.errors}
              </p>
            </div>
            <SubmitButton text='Finish onboarding' />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
