import Image from 'next/image';
import { Box, Divider, Grid, Typography } from '@mui/material';
import React from "react";

export default function Home() {
    
  return (
    <Box
    sx={{
      //border:'5px solid black',
      display: 'flex',
      justifyContent: 'center',
    }}
    >

      <Grid container spacing={2}
        sx={{
          //border: '2px solid black',
          width: '100%',
          maxWidth: '90%',
          height: 'fit-content',
        }}
      >
        <Grid size={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              //border:'5px solid red',
              display: 'flex',
              textAlign: 'center',
              paddingTop: '20px',
              fontWeight: 'bold',
              color: 'black',
              fontSize: '40px',
              maxWidth: '800px',
            }}
          >
          Equipo Multidisciplinario para la Sostenibilidad hídrica (EMUSHI)
          </Typography>
        </Grid>
        <Grid size={6}
          sx={{
          //border: '2px solid green',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          padding: '10px',
          position: "relative",
          }}
        >
        <Image src={'/Logonuevo.png'} width={0} height={0} alt="..." layout="responsive"/>
        </Grid>

        <Grid size={6}
          sx={{
                //border: '2px solid green',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
          }}
        >
          <Typography
            sx={{
              //fontWeight: 'bold',
              color: 'black',
              textAlign: 'justify',
              fontSize: '25px'
            }}
          >
            Este proyecto tiene como objetivo medir la cantidad de agua utilizada en los baños y mingitorios de la Facultad de Ingeniería, con el fin de recabar información sobre su consumo. A partir de estos datos, se busca diseñar e implementar un sistema de captación pluvial que contribuya al uso más eficiente del recurso hídrico.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
