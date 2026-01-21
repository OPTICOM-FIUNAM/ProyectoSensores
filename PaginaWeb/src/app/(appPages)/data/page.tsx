'use client'
import { Box, Card, CardContent, Grid, Paper, Skeleton, Typography } from '@mui/material';
import SensoresDataGrid from "../../ui/SensoresDataGrid";
import DataGridSkeleton from '../../ui/DataGridLoading';
import SensoresHeatMap from '../../ui/SensoresHeatMap';
import { useSearchParams } from 'next/navigation';
import useDischargeFilters from '../../Hooks/useDischargeFilters';
import useHeatmapData from '../../Hooks/useHeatmapData';
import { SessionProvider } from 'next-auth/react';
import AuthStatus from '../../components/LogIn';


export default function UsuariosPage() {
  const {status, rows, filters} = useDischargeFilters();
  const params = useSearchParams();
  filters.school = params.get('facultad') || '';
  filters.building = params.get('edificio') || '';
  const heatmapData = useHeatmapData(rows);
  let totalMlUsed=0

  rows.forEach(discharge =>{
    totalMlUsed+=Number(discharge.mlPerUse)
  })

  return (
    <>
      <AuthStatus/>
      <Typography
                  sx={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: 'black',
                      fontSize: '40px',
                      mt: 2,
                      mb: 5
                  }} 
                  >Descargas</Typography>
      <Grid container rowSpacing={5} columnSpacing={1}>
        <Grid size={4}/>
        <Grid size={2}>
          <Card>
            <CardContent>
              <Typography fontSize='20px' fontWeight='bold' gutterBottom align='center'>{'Total de descargas:'}</Typography>
              {rows.length === 0 && status === 102 ? (<Skeleton variant='text' sx={{fontSize: '20px'}}/>) : (
                <Typography fontSize='20px' gutterBottom align='center'>{rows.length}</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={2}>
          <Card>
            <CardContent>
              <Typography fontSize='20px' fontWeight='bold' gutterBottom align='center'>{'Agua utilizada: '}</Typography>
              {rows.length === 0 && status === 102 ? (<Skeleton variant='text' sx={{fontSize: '20px'}}/>) : (
                <Typography fontSize='20px' gutterBottom align='center'>{totalMlUsed/1000+' L'}</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}/>
        <Grid size={2}/>
          <Grid size={8}>
          
          <Paper sx={{height: 500}} elevation={3}>
            {rows.length === 0 && status === 102 ? (<DataGridSkeleton height={500}/>) : (
            <SensoresDataGrid rows={rows}/>
          )}
          </Paper>
        </Grid>
        <Grid size={2}/>
        <Grid size={2}/>
        <Grid size={8}>
          <Paper elevation={3}>
          {rows.length === 0 && status === 102 ? (<DataGridSkeleton height={200}/>) : (
            <SensoresHeatMap heatmapData={heatmapData}/>
          )}
          </Paper>
          <Box height={100}/>

        </Grid>
      </Grid>
    </>
  );
}