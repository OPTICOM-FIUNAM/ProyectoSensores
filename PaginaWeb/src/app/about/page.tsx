//pagina "acerca de"
import Image from 'next/image';
import { Box, Divider, Grid, Typography } from '@mui/material';
import React from "react";
import Participantes from '../components/Participantes';

function page() {
    return (
       <Box
       sx={{
        //border:'5px solid black',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '20px',
        paddingLeft: {
            sm: '25px',
            md: '250px'
        },
        paddingRight: {
            sm: '25px',
            md: '250px'
        },
        
       }}
       >
        <Typography
        sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'black',
            fontSize: '40px',
        }} 
        >
            ¿Quienes somos?
        </Typography>

        <Image src={'/Photo.jpg'} width={600} height={320} alt='...'
        style={{
            width: '100%', 
            height: 'auto',
            margin: '0 auto',
            marginTop: '20px',
            borderRadius: '50px',
        }}
        />

        <Typography 
        sx={{
            textAlign: 'justify',
            color: 'black',
            fontSize: '18px',
            paddingTop: '30px',
        }} 
        >
            Somos un equipo multidisciplinario de estudiantes y docentes de la Facultad de Ingeniería de la Universidad Nacional Autónoma de México, comprometidos con el desarrollo de soluciones sustentables que promuevan el uso responsable del agua.
        </Typography>
        
        <Typography 
        sx={{
            textAlign: 'justify',
            color: 'black',
            fontSize: '18px',
            paddingTop: '15px',
        }} 
        >
            Nuestro equipo está integrado por participantes de diversas carreras, entre ellas Ingeniería en Computación, Eléctrica-Electrónica, Telecomunicaciones, Ciencias de la Tierra y Geología, lo que nos permite abordar los desafíos desde múltiples perspectivas.    
        </Typography>
        
        <Typography 
        sx={{
            textAlign: 'justify',
            color: 'black',
            fontSize: '18px',
            paddingTop: '15px',
        }} 
        >
            El proyecto se encuentra bajo la coordinación de los ingenieros Christian Hernández Santiago y Cristian Emmanuel González Reyes.
        </Typography>
        
        <Typography
        sx={{
            paddingTop: '20px',
            textAlign: 'left',
            fontWeight: 'bold',
            color: 'black',
            fontSize: '30px',
        }} 
        >
        Misión        
        </Typography>
        <Typography 
        sx={{
            textAlign: 'justify',
            color: 'black',
            fontSize: '18px',
            paddingTop: '10px',
        }} 
        >
            Nuestra misión es contribuir a la gestión eficiente del agua mediante la implementación de tecnologías de medición y aprovechamiento del agua de lluvia.
        </Typography>

        <Typography
        sx={{
            paddingTop: '20px',
            textAlign: 'left',
            fontWeight: 'bold',
            color: 'black',
            fontSize: '30px',
        }} 
        >
            Visión        
        </Typography>

        <Typography 
        sx={{
            textAlign: 'justify',
            color: 'black',
            fontSize: '18px',
            paddingTop: '10px',
        }} 
        >
            Aspiramos recabar los datos necesarios para implementar un sistema de captación pluvial que contribuya al uso más eficiente del agua. Asimismo, buscamos escalar este proyecto a nivel institucional, promoviendo su adopción dentro de la comunidad universitaria y generando un impacto positivo en la gestión del agua.
        </Typography>

        <Typography
        sx={{
            paddingTop: '20px',
            textAlign: 'left',
            fontWeight: 'bold',
            color: 'black',
            fontSize: '30px',
        }} 
        >
            ¿Qué hacemos?        
        </Typography>

        <Typography 
        sx={{
            textAlign: 'justify',
            color: 'black',
            fontSize: '18px',
            paddingTop: '10px',
            paddingBottom: '30px',
        }} 
        >
            Actualmente nos encontramos en la fase de diagnóstico, donde monitoreamos el consumo de agua en baños y mingitorios. Con base en estos datos, planeamos diseñar un sistema de captación pluvial en la Facultad de Ingeniería.
        </Typography>

        <Participantes/>

       </Box>
    );
}

export default page;