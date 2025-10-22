import * as React from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type PaginationProps = {
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  className?: string
}

export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 15, 25],
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const previousDisabled = page <= 1
  const nextDisabled = page >= totalPages

  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-t border-border/50 pt-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between',
        className,
      )}
    >
      <nav
        className="flex min-h-[3rem] flex-wrap items-center gap-2 rounded-full border border-border/60 bg-card px-2 py-1 shadow-sm"
        aria-label="Paginacao"
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 border border-border/60"
          onClick={() => onPageChange(page - 1)}
          disabled={previousDisabled}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Pagina anterior</span>
        </Button>
        <div className="rounded-full bg-muted/60 px-4 py-1 text-sm font-semibold text-foreground">
          Pagina {page} de {totalPages}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 border border-border/60"
          onClick={() => onPageChange(page + 1)}
          disabled={nextDisabled}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Proxima pagina</span>
        </Button>
      </nav>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Itens por pagina</span>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2 rounded-full border-border/60 bg-card px-4 shadow-sm">
              <span className="font-semibold text-foreground">{pageSize}</span>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={8}
              className="z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border/60 bg-popover text-popover-foreground shadow-xl"
            >
              {pageSizeOptions.map((option) => (
                <DropdownMenu.Item
                  key={option}
                  className={cn(
                    'flex cursor-pointer select-none items-center gap-2 px-3 py-2 text-sm outline-none transition',
                    'hover:bg-muted hover:text-foreground data-[highlighted]:bg-muted data-[highlighted]:text-foreground',
                    option === pageSize && 'bg-muted/50 font-semibold text-foreground',
                  )}
                  onSelect={() => onPageSizeChange?.(option)}
                >
                  {option} itens
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <span className="rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-foreground/80 shadow-sm">
          {Math.min(page * pageSize, totalItems)} de {totalItems} itens
        </span>
      </div>
    </div>
  )
}
