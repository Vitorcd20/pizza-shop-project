import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "./ui/button";

interface PaginationProps {
  pageIndex: number;
  totalCount: number;
  perPage: number;
  onPageChange: (pageIndex: number) => Promise<void> | void;
}

export function Pagination({
  pageIndex,
  perPage,
  totalCount,
  onPageChange,
}: PaginationProps) {
  const pages = Math.ceil(totalCount / perPage) || 1;

  const controls = [
    {
      icon: ChevronsLeft,
      label: "First page",
      action: () => onPageChange(0),
      disabled: pageIndex === 0,
    },
    {
      icon: ChevronLeft,
      label: "Previous page",
      action: () => onPageChange(pageIndex - 1),
      disabled: pageIndex === 0,
    },
    {
      icon: ChevronRight,
      label: "Next page",
      action: () => onPageChange(pageIndex + 1),
      disabled: pageIndex + 1 >= pages,
    },
    {
      icon: ChevronsRight,
      label: "Last page",
      action: () => onPageChange(pages - 1),
      disabled: pageIndex + 1 >= pages,
    },
  ];

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Total of {totalCount} item(s)
      </span>

      <div className="flex items-center gap-6 lg:gap-8">
        <div className="text-sm font-medium">
          Page {pageIndex + 1} of {pages}
        </div>
        <div className="flex items-center gap-2">
          {controls.map(({ icon: Icon, label, action, disabled }, i) => (
            <Button
              key={i}
              onClick={action}
              variant="outline"
              className="w-8 h-8"
              disabled={disabled}
            >
              <Icon className="w-4 h-4" />
              <span className="sr-only">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
