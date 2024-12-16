import React from "react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

interface FilterSortBarProps {
  filter: string;
  setFilter: (value: string) => void;
  prioritySort: string;
  dueDateSort: string;
  handlePrioritySortChange: (value: string) => void;
  handleDueDateSortChange: (value: string) => void;
}

const FilterSortBar: React.FC<FilterSortBarProps> = ({
  filter,
  setFilter,
  prioritySort,
  dueDateSort,
  handlePrioritySortChange,
  handleDueDateSortChange,
}) => {
  return (
    <div className="mb-4 flex gap-2">
      <Select value={filter} onValueChange={(value) => setFilter(value === "all" ? "" : value)}>
        <SelectTrigger className="w-40 rounded border p-2">
          {filter ? filter.charAt(0).toUpperCase() + filter.slice(1) : "All"}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="to-do">To do</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={handlePrioritySortChange}>
        <SelectTrigger className="w-40 rounded border p-2">
          {prioritySort === "default"
            ? "Sort by Priority"
            : prioritySort === "priority-asc"
              ? "Low to High"
              : "High to Low"}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Sort by Priority</SelectItem>
          <SelectItem value="priority-asc">Low to High</SelectItem>
          <SelectItem value="priority-desc">High to Low</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={handleDueDateSortChange}>
        <SelectTrigger className="w-40 rounded border p-2">
          {dueDateSort === "default"
            ? "Sort by Due Date"
            : dueDateSort === "due-date-asc"
              ? "Ascending"
              : "Descending"}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Sort by Due Date</SelectItem>
          <SelectItem value="due-date-asc">Ascending</SelectItem>
          <SelectItem value="due-date-desc">Descending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSortBar;
