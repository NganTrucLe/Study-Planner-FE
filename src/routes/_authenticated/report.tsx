import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/report')({
  component: () => <div>Hello /_authenticated/report!</div>,
})
