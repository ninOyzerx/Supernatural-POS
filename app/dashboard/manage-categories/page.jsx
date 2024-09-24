"use client";
import React, { useEffect, useState } from 'react';
import { Grid, Box, Paper } from '@mui/material';
import PageContainer from '../components/container/PageContainer';
import dynamic from 'next/dynamic';

const DataTable = dynamic(() => import('react-data-table-component'), { ssr: false });

const columns = [
  {
    name: 'ชื่อหมวดหมู่',
    selector: row => row.name,
    sortable: true,
  },
  {
    name: 'คำอธิบายหมวดหมู่สินค้า',
    selector: row => row.description,
    sortable: true,
  },
  {
    name: 'รูปภาพ',
    selector: row => row.category_img,
    sortable: true,
  },
];

const ManageCategory = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/categories/manage-categories');
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <PageContainer title="Manage Categories" description="This is the Manage Categories page">
      <Box p={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <DataTable
                  title="จัดการหมวดหมู่สินค้า"
                  columns={columns}
                  data={data}
                  pagination
                  highlightOnHover
                  striped
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default ManageCategory;
