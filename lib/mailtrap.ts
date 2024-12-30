import { MailtrapClient } from 'mailtrap'

export const emailClient = new MailtrapClient({
  token: process.env.EMAIL_TOKEN!,
})
