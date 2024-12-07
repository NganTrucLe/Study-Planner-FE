import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/progress')({
  component: () => <div>Hello /_authenticated/progress!</div>,
})
