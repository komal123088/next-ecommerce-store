import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface PaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pages, onChange }: PaginationProps) {
  if (pages <= 1) return null;

  const pageNumbers = [];
  const delta = 2;
  for (
    let i = Math.max(1, page - delta);
    i <= Math.min(pages, page + delta);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        icon={<ChevronLeft className="w-4 h-4" />}
      >
        Prev
      </Button>

      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onChange(1)}
            className="w-9 h-9 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            1
          </button>
          {pageNumbers[0] > 2 && <span className="px-2 text-gray-400">…</span>}
        </>
      )}

      {pageNumbers.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${n === page ? "bg-blue-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
        >
          {n}
        </button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < pages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < pages - 1 && (
            <span className="px-2 text-gray-400">…</span>
          )}
          <button
            onClick={() => onChange(pages)}
            className="w-9 h-9 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {pages}
          </button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        icon={<ChevronRight className="w-4 h-4" />}
      >
        Next
      </Button>
    </div>
  );
}
