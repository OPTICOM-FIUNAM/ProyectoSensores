import Image from 'next/image';
import { Box, Divider, Grid, Typography } from '@mui/material';
import React from "react";

const Tarjeta = ({name, degree, image}) => {
    return (
        <>
        <Image src={image} width={600} height={320} alt='...'
        style={{
            width: '90%', 
            height: 'auto',
            margin: '0 auto',
            marginTop: '20px',
            borderRadius: '100px',
        }}
        />
        <Typography
        sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'black',
            fontSize: '15px',
        }} 
        >
            {name}
        </Typography>

        <Typography
        sx={{
            textAlign: 'center',
            fontStyle: 'italic',
            color: 'black',
            fontSize: '15px',
        }} 
        >
            {degree}
        </Typography>
</>
    );
}

export default Tarjeta;