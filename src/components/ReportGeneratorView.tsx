// src/components/ReportGeneratorView.tsx

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useReportData, ReportData, PaginatedReportResponse } from '@/lib/dataHooks';
import { T } from '@/contexts/LanguageContexts';
import { Download, ChevronDown, ArrowUpDown, Loader2, Search } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table';
import { DatePickerWithRange } from '@/components/DatePickerWithRange';

const ReportGeneratorView: React.FC = () => {
  // State for the date picker UI
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -90),
    to: new Date(),
  });

  // This state is what the data hook will actually use to fetch data
  const [appliedDate, setAppliedDate] = useState<DateRange | undefined>(undefined);

  // State for the table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15, // Show 15 rows per page
  });

  // The data fetching hook
  const { data: paginatedData, isFetching, error } = useReportData(appliedDate, { pageIndex, pageSize });

  const reportData = useMemo(() => paginatedData?.data ?? [], [paginatedData]);
  const totalCount = useMemo(() => paginatedData?.total_count ?? 0, [paginatedData]);
  const pageCount = Math.ceil(totalCount / pageSize);

  const columns = useMemo<ColumnDef<ReportData>[]>(() => [
    { accessorKey: 'wmo_id', header: () => <T>ARGO ID</T> },
    {
      accessorKey: 'timestamp',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <T>Timestamp</T> <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const timestamp = row.getValue('timestamp');
        return timestamp ? new Date(timestamp as string).toLocaleString() : <span className="text-muted-foreground">N/A</span>;
      },
    },
    { accessorKey: 'region', header: () => <T>Region</T> },
    { accessorKey: 'temperature', header: () => <T>Temp (°C)</T>, cell: ({ row }) => row.getValue<number>('temperature')?.toFixed(2) },
    { accessorKey: 'salinity', header: () => <T>Salinity (PSU)</T>, cell: ({ row }) => row.getValue<number>('salinity')?.toFixed(2) },
    { accessorKey: 'pressure', header: () => <T>Pressure (dbar)</T>, cell: ({ row }) => row.getValue<number>('pressure')?.toFixed(2) },
  ], []);

  const table = useReactTable({
    data: reportData,
    columns,
    pageCount: pageCount,
    state: { sorting, columnVisibility, pagination: { pageIndex, pageSize } },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: false, // Client-side sorting is fine for small pages
  });
  
  const handleApplyFilters = () => {
    setPagination(p => ({ ...p, pageIndex: 0 })); // Reset to first page
    setAppliedDate(date); // Set the date to trigger the fetch
  };

  const handleDownload = () => { /* Download logic remains the same */ };

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 bg-background animate-fade-in-up">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2"><T>Report Generator</T></h1>
          <p className="text-muted-foreground"><T>Filter, sort, and export ARGO float measurement data</T></p>
        </div>

        <Card className="card-shadow border-border/20">
          <CardHeader><CardTitle><T>Filter & Export</T></CardTitle><CardDescription><T>Select a date range and columns, then apply to generate your report.</T></CardDescription></CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-4">
            <DatePickerWithRange date={date} setDate={setDate} />
            <Button onClick={handleApplyFilters} disabled={isFetching}>
                {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                <T>Apply Filters</T>
            </Button>
            <div className="flex-grow" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline"><T>Columns</T><ChevronDown className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">{table.getAllColumns().filter(col => col.getCanHide()).map(column => (<DropdownMenuCheckboxItem key={column.id} checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}><T>{column.id}</T></DropdownMenuCheckboxItem>))}</DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleDownload} disabled={table.getRowModel().rows.length === 0}><Download className="mr-2 h-4 w-4" /> <T>Download CSV</T></Button>
          </CardContent>
        </Card>

        <Card className="card-shadow border-border/20">
          <CardHeader>
            <CardTitle><T>Report Data</T></CardTitle>
            <CardDescription><T>Showing page</T> {pageIndex + 1} <T>of</T> {pageCount} (<T>Total records</T>: {totalCount})</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>{table.getHeaderGroups().map(headerGroup => (<TableRow key={headerGroup.id}>{headerGroup.headers.map(header => (<TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>))}</TableRow>))}</TableHeader>
                <TableBody>
                  {isFetching ? (
                    <TableRow><TableCell colSpan={columns.length} className="h-24 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin" /></TableCell></TableRow>
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map(row => (<TableRow key={row.id}>{row.getVisibleCells().map(cell => (<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>))}</TableRow>))
                  ) : (
                    <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">{appliedDate ? <T>No results for the selected date range.</T> : <T>Select a date range and click 'Apply Filters' to begin.</T>}</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <span className="text-sm text-muted-foreground"><T>Page</T> {pageIndex + 1} of {pageCount}</span>
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportGeneratorView;