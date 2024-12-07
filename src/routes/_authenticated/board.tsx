import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/board')({
  component: () => <div>Hello /_authenticated/board!</div>,
})
