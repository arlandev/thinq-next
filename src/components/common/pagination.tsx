'use client';

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationInfo {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startIndex: number;
    endIndex: number;
}

interface PaginationProps {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function Pagination({ pagination, onPageChange, className = "" }: PaginationProps) {
    const { currentPage, totalPages, hasNextPage, hasPreviousPage, totalItems, startIndex, endIndex } = pagination;

    // Generate page numbers to display
    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Calculate start and end of visible range
            let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(totalPages, start + maxVisible - 1);

            // Adjust start if end is at the limit
            if (end === totalPages) {
                start = Math.max(1, end - maxVisible + 1);
            }

            // Add first page and ellipsis if needed
            if (start > 1) {
                pages.push(1);
                if (start > 2) {
                    pages.push('...');
                }
            }

            // Add visible pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add last page and ellipsis if needed
            if (end < totalPages) {
                if (end < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={`flex items-center justify-between px-2 ${className}`}>
            {/* Items info */}
            <div className="text-sm text-muted-foreground">
                Showing {startIndex} to {endIndex} of {totalItems} results
            </div>

            {/* Pagination controls */}
            <div className="flex items-center space-x-2">
                {/* Previous button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPreviousPage}
                    className="flex items-center gap-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                    {pageNumbers.map((page, index) => (
                        <div key={index}>
                            {page === '...' ? (
                                <span className="px-2 py-1 text-sm text-muted-foreground">...</span>
                            ) : (
                                <Button
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange(page as number)}
                                    className="w-8 h-8 p-0"
                                >
                                    {page}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Next button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className="flex items-center gap-1"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
