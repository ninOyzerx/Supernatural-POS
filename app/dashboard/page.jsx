"use client";
import React from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from '../dashboard/components/container/PageContainer';
// components
import SalesOverview from '../dashboard/components/dashboard/SalesOverview';
import YearlyBreakup from '../dashboard/components/dashboard/YearlyBreakup';
import RecentTransactions from '../dashboard/components/dashboard/RecentTransactions';
import ProductPerformance from '../dashboard/components/dashboard/ProductPerformance';
import Blog from '../dashboard/components/dashboard/Blog';
import MonthlyEarnings from '../dashboard/components/dashboard/MonthlyEarnings';

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="This is the Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
          <Grid item xs={12}>
            <Blog />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default Dashboard;
