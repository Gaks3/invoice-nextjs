import { requireUser } from '@/lib/hooks'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '@/public/logo.png'
import DashboardLinks from '@/components/dashboard-links'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { MenuIcon, User2Icon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/lib/auth'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'

async function getUser(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstName: true,
      lastName: true,
      address: true,
    },
  })

  if (!data?.firstName || !data.lastName || !data.address)
    return redirect('/onboarding')
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireUser()
  await getUser(session.user!.id!)

  const handleSignOut = async () => {
    'use server'

    await signOut()
  }

  return (
    <>
      <div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
        <div className='hidden border-r bg-muted/40 md:block'>
          <div className='flex flex-col max-h-screen h-full gap-2'>
            <div className='h-14 flex items-center border-b px-4 lg:h-[60px] lg:px-6'>
              <Link href={'/'} className='flex items-center gap-2'>
                <Image src={Logo} alt='Logo' className='size-7' />
                <p className='text-2xl font-bold'>Invoice</p>
              </Link>
            </div>
            <div className='flex-1'>
              <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
                <DashboardLinks />
              </nav>
            </div>
          </div>
        </div>
        <div className='flex flex-col'>
          <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-[6px]'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={'outline'} size={'icon'} className='md:hidden'>
                  <MenuIcon className='size-5' />
                </Button>
              </SheetTrigger>
              <SheetContent side={'left'}>
                <nav className='grid gap-2 mt-10'>
                  <DashboardLinks />
                </nav>
              </SheetContent>
            </Sheet>
            <div className='flex items-center ml-auto'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className='rounded-full'
                    variant={'outline'}
                    size={'icon'}
                  >
                    <User2Icon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={'/dashboard'}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={'/dashboard/invoices'}>Invoices</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form className='w-full' action={handleSignOut}>
                      <button className='w-full text-left text-destructive'>
                        Log out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className='flex flex-1 flex-col gap-4 lg:gap-6 lg:p-6 p-4'>
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
