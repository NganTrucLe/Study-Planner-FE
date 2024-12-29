import FocusSessionsByDay from "../organisms/charts/focus-sessions-by-day";
import TasksBySubject from "../organisms/charts/tasks-by-subject";

export default function AnalyticsPage() {
  return (
    <div>
      <FocusSessionsByDay />
      <TasksBySubject />
    </div>
  );
}
