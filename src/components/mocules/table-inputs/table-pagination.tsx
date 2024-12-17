import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pageSizes } from "@/lib/types";

type ReactTablePaginationProps = {
  pageCount: number;
  pageOffset: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  setPageIndex: (index: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
};

export default function ReactTablePagination({
  pageCount,
  pageOffset,
  pageSize = 10,
  setPageSize,
  setPageIndex,
  canPreviousPage,
  canNextPage,
}: ReactTablePaginationProps) {
  const selectValues = pageSizes;

  return (
    <div className="flex w-max items-center gap-3 self-end px-5 py-4 text-sm">
      Show:
      <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Show" />
        </SelectTrigger>
        <SelectContent>
          {selectValues.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      Go to page:
      <Input
        type="number"
        defaultValue={pageOffset + 1}
        onChange={(e) => setPageIndex(e.target.value ? Number(e.target.value) - 1 : 0)}
        className="w-12"
        min={1}
        max={pageCount}
      />
      <span className="flex items-center gap-1">
        <div> Page</div>
        <strong>
          {pageOffset + 1} of {pageCount}
        </strong>
      </span>
      <Button
        size="icon"
        variant="outline"
        onClick={() => setPageIndex(0)}
        disabled={!canPreviousPage}
      >
        <ChevronsLeft size={16} />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => setPageIndex(pageOffset - 1)}
        disabled={!canPreviousPage}
      >
        <ChevronLeft size={16} />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => setPageIndex(pageOffset + 1)}
        disabled={!canNextPage}
      >
        <ChevronRight size={16} />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => setPageIndex(pageCount - 1)}
        disabled={!canNextPage}
      >
        <ChevronsRight size={16} />
      </Button>
    </div>
  );
}
