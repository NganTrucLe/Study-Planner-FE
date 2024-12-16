import { EnumTaskStatus } from "@/lib/enums";

export function formatStatus(status: EnumTaskStatus) {
  if (status === EnumTaskStatus.TODO) {
    return "To Do";
  } else if (status === EnumTaskStatus.IN_PROGRESS) {
    return "In Progress";
  } else {
    return "Done";
  }
}
