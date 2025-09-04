import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';

import React from 'react';


export default function SensoresDataGrid({rows}){

    const columns: GridColDef[] = [
        { field: 'dischargeID', headerName: 'ID', width: 50 },
        { field: 'name', headerName: 'Facultad', width: 300 },
        { field: 'building', headerName: 'Edificio', width: 90 },
        { field: 'floor', headerName: 'Piso', width: 20 },
        { field: 'gender', headerName: 'Género', width: 70 },
        { field: 'type', headerName: 'Mueble', width:70},
        { field: 'mlPerUse', headerName: 'mL usados', width: 100 },
        { field: 'formatedDate', headerName: 'Fecha', width: 150 },
        { field: 'formatedTime', headerName: 'Hora', width: 150 },
        
        
      ];
    
    return (
            <DataGrid
                rows={rows}
                disableColumnFilter
                columns={columns}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                getRowId={(row) => row.dischargeID}
                sx={{
                    background: '#FFFFFF',
                    color: '#000000',
                    border: '1px solid #DDD',
                    '& .MuiDataGrid-columnHeaderTitle':{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                    },
                    '& .MuiDataGrid-columnHeaders':{
                        background: '#FFFFFF',
                        backgroundColor: '#FFFFFF', 
                        borderBottom: '2px solid #DDD',
                        
                        
                    },
                    '& .MuiDataGrid-row:hover':{backgroundColor: '#E3E5F1'},
                    '& .MuiDataGrid-cell': {
                        textAlign: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                    },
                }}
            />
    );
}