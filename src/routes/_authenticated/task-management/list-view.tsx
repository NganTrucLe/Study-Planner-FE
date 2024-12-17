import TaskManager from '@/components/pages/task-management'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/task-management/list-view',
)({
  component: TaskManager,
})
