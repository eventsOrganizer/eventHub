"use client";

import React, { useState, useEffect } from 'react';
import ComplaintTable from '@/components/dashboard/complaints/complaint-table';
import ComplaintFilters from '@/components/dashboard/complaints/complaint-filters';
import { supabase } from '@/lib/supabase-client';

interface Complaint {
  id: number;
  created_at: string;
  status: string;
  category: string;
  title: string;
}

const ComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState({ search: '', status: '', category: '' });

  useEffect(() => {
    const fetchComplaints = async () => {
      let query = supabase.from('complaints').select('*', { count: 'exact' });

      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error, count } = await query
        .order('id', { ascending: false })
        .range(page * rowsPerPage, (page + 1) * rowsPerPage - 1);

      if (error) {
        console.error('Error fetching complaints:', error);
      } else {
        setComplaints(data);
        setCount(count || 0);
      }
    };

    fetchComplaints();
  }, [page, rowsPerPage, filters]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (newFilters: { search: string; status: string; category: string }) => {
    setFilters(newFilters);
    setPage(0); // Reset to first page on filter change
  };

  return (
    <div>
      <ComplaintFilters onFilterChange={handleFilterChange} />
      <ComplaintTable
        complaints={complaints}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSelectionChange={(selected) => console.log(selected)}
      />
    </div>
  );
};

export default ComplaintsPage;