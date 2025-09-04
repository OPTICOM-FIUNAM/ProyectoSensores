import Image from 'next/image';

import { Box, Grid, Typography } from '@mui/material';

const Logos = () => {
    return (
        <Box
            sx={{
                //border:'2px solid black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                color:'black',
                backgroundColor:'#D9D9D9',
                borderTop: '20px solid #e20e0e',
                height:'fit-content',
                padding: '10px',
                marginTop: '20px',
            }}
        >
            <Grid container
                sx={{
                    //border:'2px solid black',
                    width: '100%',
                    height: '100%',
                }}
            >
                <Grid size={6}
                    sx={{
                        //border:'2px solid green',
                        display: 'flex',
                        flexWrap: 'wrap',  
                        justifyContent: 'rigth',
                        alignItems: 'center',
                        gap: '15px'
                    }}
                >
                    <Image src = {'/LogoOpticom.png'} width={80} height={80} alt="..."/>
                    <Image src = {'/LogoDIE.png'} width={80} height={40} alt="..."/>
                    <Image src = {'/LogoDICyG.png'} width={70} height={70} alt="..."/>
                    <Image src = {'/LogoDiCT.png'} width={80} height={70} alt="..."/>
                    <Image src = {'/LogoUAT.png'} width={70} height={60} alt="..."/>
                </Grid>

                <Grid size={6}
                    sx={{
                        //border:'2px solid green',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            //fontWeight: 'bold',
                            fontSize: '12px',
                        }}
                    >
                        Universidad Nacional Autónoma de México
                        <br/>
                        Facultad de Ingeniería, Av. Universidad 3000, Ciudad Universitaria, Coyoacán, Cd. Mx., CP 04510
                        <br/> <br/>
                        Copyrights © 2025 
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Logos;