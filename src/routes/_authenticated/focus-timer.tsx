import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/focus-timer')({
  component: () => <div>Hello /_authenticated/focus-timer!</div>,
})
