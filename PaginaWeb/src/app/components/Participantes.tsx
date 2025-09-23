import Image from 'next/image';
import { Box, Divider, Grid, Typography } from '@mui/material';
import React from "react";
import Tarjeta from './Tarjeta';
import Estudiantes from './Estudiantes';

const Participantes = () => {
    const lider = [{name:'M.I. Christian Hernández Santiago',degree:'Ingeniería en Telecomunicaciones',image:'/CHR.jpeg'},{name:'M.I. Cristian Emmanuel González Reyes',degree:'Ingeniería Civil',image:'/CRI.jpeg'}, {name:'M.I. Christian Hernández Santiago A',degree:'Ingeniería en Telecomunicaciones',image:'/Sonrriente.jpg'}]

    const students = [{name:'Ileana Angélica Cordero Martínez',career:'Ingeniería en Computación'},{name:'Angel Uriel Pineda Migranas',career:'Ingeniería en Computación'}, {name:'André Carreño Limones',career:'Ingeniería en Computación'},{name:'Guillermo Cruz',career:'Ingeniería Aeroespacial'},{name:'Iván Arturo Olvera Martínez',career:'Ingeniería Eléctrica Electrónica'}, {name:'Ana Cristina Ramírez Monzón',career:'Ingeniería en Computación'}]

    return(
        <>
        <Box
        sx={{
            //border:'5px solid black',
            display: 'flex',
            flexDirection: 'column',
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
                Líderes
            </Typography>

            <Grid container
            sx={{
                //border:'2px solid black',
                width: '100%',
                height: '100%',
            }}
            >
                {lider.map((participante)=>(
                    <Grid size={4}
                        sx={{
                            //border:'2px solid green',
                            display: 'flex',
                            flexWrap: 'wrap',  
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '10px',
                        }}
                        key={participante.name}
                    >
                        <Tarjeta name={participante.name} degree={participante.degree} image={participante.image} />
                    </Grid>
                ))}
                
            </Grid>
        </Box>

        <Box
        sx={{
            //border:'5px solid black',
            display: 'flex',
            flexDirection: 'column',
            }}
        >
            <Typography
            sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'black',
                fontSize: '40px',
                marginTop: '30px',
                marginBottom: '20px',
            }} 
            >
                Estudiantes
            </Typography>

            <Grid container
            sx={{
                //border:'2px solid green',
                width: '100%',
                height: '100%',
            }}
            >
                {students.map((student)=>(
                    <Grid size={4}
                        sx={{
                            border:'1px solid black',
                            display: 'flex',
                            flexWrap: 'wrap',  
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '10px',
                        }}
                        key={student.name}
                    >
                        <Estudiantes name={student.name} career={student.career} />
                    </Grid>
                ))}
                
            </Grid>    

        </Box>
        </>
    )

}

export default Participantes;