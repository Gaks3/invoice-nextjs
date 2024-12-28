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
import { signIn } from '@/lib/auth'
import { nonAuthenticatedPage } from '@/lib/hooks'

export default async function Login() {
  await nonAuthenticatedPage()

  return (
    <>
      <div className='flex h-screen w-full items-center justify-center px-4'>
        <Card className='max-w-sm'>
          <CardHeader>
            <CardTitle className='text-2xl'>Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className='flex flex-col gap-y-4'
              action={async (formData) => {
                'use server'
                await signIn('nodemailer', formData)
              }}
            >
              <div className='flex flex-col gap-y-2'>
                <Label>Email</Label>
                <Input
                  placeholder='john@hello.com'
                  name='email'
                  type='email'
                  required
                />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
