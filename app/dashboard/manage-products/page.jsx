"use client";
import React, { useEffect, useState } from 'react';
import { Grid, Box, Paper, Button } from '@mui/material';
import PageContainer from '../components/container/PageContainer';
import dynamic from 'next/dynamic';
import AddProductModal from './add-product'; 

const DataTable = dynamic(() => import('react-data-table-component'), { ssr: false });

const columns = [
  { name: 'ชื่อสินค้า', selector: row => row.product_name, sortable: true },
  { name: 'รหัสสินค้า', selector: row => row.product_code, sortable: true },
  { name: 'ราคา', selector: row => row.price, sortable: true },
  { name: 'จำนวนสินค้าในคลัง', selector: row => row.stock_quantity, sortable: true },
  {
    name: 'Actions',
    cell: row => (
      <>
        <Button onClick={() => handleEdit(row)}>Edit</Button>
        <Button onClick={() => handleDelete(row.id)}>Delete</Button>
      </>
    ),
  },
];

const ManageProduct = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/products/manage-products');
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAdd = async (product) => {
    try {
      const response = await fetch('/api/products/manage-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEdit = async (product) => {
    // Implement edit functionality
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/products/manage-products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <PageContainer title="Manage Products" description="This is the Manage Products page">
      <Box p={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <Button onClick={() => setOpen(true)} variant="contained" sx={{ mb: 2 }}>Add Product</Button>
                <DataTable
                  title="จัดการรายการสินค้า"
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
      <AddProductModal open={open} handleClose={() => setOpen(false)} handleAdd={handleAdd} />
    </PageContainer>
  );
}

export default ManageProduct;
