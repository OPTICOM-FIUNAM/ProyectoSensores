import { Box, Divider, Grid, Typography } from '@mui/material';
import React from "react";

const Estudiantes = ({name, career}) => {
    return (
        <>
        <Typography
        sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'black',
            fontSize: '14px',
        }} 
        >
            {name}
        </Typography>

        <Typography
        sx={{
            textAlign: 'center',
            fontStyle: 'italic',
            color: 'black',
            fontSize: '14px',
        }} 
        >
            {career}
        </Typography>

</>
    );
}

export default Estudiantes;