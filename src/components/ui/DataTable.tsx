import React from 'react';
import { ChevronLeft, ChevronRight, Search, Plus, Filter, MoreHorizontal, Edit, Trash, Eye } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey: keyof T;
    cell?: (item: T) => React.ReactNode;
  }[];
  title: string;
  description?: string;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  searchPlaceholder?: string;
  loading?: boolean;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  title,
  description,
  onAdd,
  onEdit,
  onDelete,
  onView,
  searchPlaceholder = "Search...",
  loading = false,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
      <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0B1830]">{title}</h2>
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder={searchPlaceholder} 
              className="pl-9 h-9 w-64 bg-slate-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          {onAdd && (
            <Button size="sm" className="h-9 bg-[#0C6D62] hover:bg-[#0C6D62]/90" onClick={onAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-4 font-semibold tracking-wider">{col.header}</th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th className="px-6 py-4 text-right font-semibold tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-[#0C6D62] rounded-full animate-spin mb-4"></div>
                    Loading data...
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    No results found
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  {columns.map((col, i) => (
                    <td key={i} className="px-6 py-4 text-slate-700">
                      {col.cell ? col.cell(item) : (item[col.accessorKey] as React.ReactNode)}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        {onView && (
                          <button onClick={() => onView(item)} className="p-2 text-slate-400 hover:text-[#0C6D62] hover:bg-[#0C6D62]/10 rounded-full transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button onClick={() => onEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(item)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete">
                            <Trash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredData.length > 0 && (
        <div className="p-4 border-t flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
          <div>Showing 1 to {filteredData.length} of {filteredData.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-white" disabled>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
