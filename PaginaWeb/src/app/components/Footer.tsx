//import Link from 'next/link';
import Image from 'next/image';

import { Box, Grid, Link, Typography } from '@mui/material';

const Logos = () => {
    return (
        <Box sx={{ backgroundColor: '#333', color: 'white' }}>
            <Box
                sx={{
                    //border:'2px solid black',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    color:'black',
                    backgroundColor:'#333',
                    height:'160px',
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
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '15px'
                        }}
                    >
                        <Link href="https://www.instagram.com/opticom.unam/?igsh=bGZrMDNoczFwcHRu#" target="_blank">
                            <Image src = {'/LogoOpticom.png'} width={150} height={150} alt="..."/>
                        </Link>
                        <Link href="https://www.fi-b.unam.mx/" target="_blank">
                            <Image src = {'/LogoDIE.png'} width={150} height={100} alt="..."/>
                        </Link>
                        <Link href="http://dicyg.fi-c.unam.mx:8080/Site" target="_blank">
                            <Image src = {'/LogoDICyG.png'} width={110} height={110} alt="..."/>
                        </Link>
                        <Link href="http://www.dict.unam.mx/" target="_blank">
                            <Image src = {'/LogoDiCT.png'} width={130} height={120} alt="..."/>
                        </Link>
                        <Link href="https://www.ingenieria.unam.mx/uat/" target="_blank">
                            <Image src = {'/LogoUAT.png'} width={120} height={110} alt="..."/>
                        </Link>
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
                                fontSize: '15px',
                                color: 'white'
                            }}
                        >
                            <Link 
                                href="https://www.unam.mx" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                underline="hover" 
                                color="inherit"
                            >
                                Universidad Nacional Autónoma de México
                            </Link>
                            <br/>
                            <Link 
                                href="https://www.ingenieria.unam.mx/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                underline="hover" 
                                color="inherit"
                            >
                                Facultad de Ingeniería
                            </Link>
                            <br/>
                            Direccion: Av. Universidad 3000, Ciudad Universitaria, Coyoacán, Cd. Mx.
                            <br/>
                            CP 04510
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    backgroundColor: 'red',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '12px',
                    padding: '5px 0',
                }}
            >
                Copyrights © 2025 
                / 
                <Link 
                    href="https://www.instagram.com/opticom.unam/?igsh=bGZrMDNoczFwcHRu#" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    underline="none" 
                    color="inherit"
                >
                    OPTICOM
                </Link>
                /
                <Link 
                    href="https://www.ingenieria.unam.mx/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    underline="none" 
                    color="inherit"
                >
                    Facultad de Ingeniería
                </Link>
                /
                <Link 
                    href="https://www.unam.mx" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    underline="none" 
                    color="inherit"
                >
                    UNAM
                </Link>
            </Box>
        </Box>
    );
}

export default Logos;