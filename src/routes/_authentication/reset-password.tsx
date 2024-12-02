import { createFileRoute } from '@tanstack/react-router'

import ResetPasswordPage from '@/components/pages/reset-password'

export const Route = createFileRoute('/_authentication/reset-password')({
  component: ResetPasswordPage,
})
