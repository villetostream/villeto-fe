"use client";

import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SortableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}

export function SortableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: SortableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const sorted = column.getIsSorted();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 font-semibold text-xs tracking-wider hover:text-gray-900 transition-colors -ml-2 px-2 py-1 rounded-md hover:bg-gray-100 cursor-pointer focus:outline-none",
            sorted && "text-gray-900",
            className
          )}
        >
          {title}
          {sorted === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-primary" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5 text-primary" />
          ) : (
            <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[150px]">
        <DropdownMenuItem
          onClick={() => column.toggleSorting(false)}
          className={cn(
            "cursor-pointer",
            sorted === "asc" && "bg-accent"
          )}
        >
          <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => column.toggleSorting(true)}
          className={cn(
            "cursor-pointer",
            sorted === "desc" && "bg-accent"
          )}
        >
          <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          Desc
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => column.clearSorting()}
          className="cursor-pointer"
        >
          <X className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
