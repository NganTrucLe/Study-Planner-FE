import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/analytics')({
  component: () => <div>Hello /_authenticated/analytics!</div>,
})
