import { taskStatuses } from "@/lib/constants";
import { EnumTaskStatus } from "@/lib/enums";

export function formatStatus(status: EnumTaskStatus) {
  return taskStatuses.find((taskStatus) => taskStatus.value === status)?.label;
}
