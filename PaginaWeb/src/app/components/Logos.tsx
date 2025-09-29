import Image from 'next/image';

import { Box, Grid, Link, Typography } from '@mui/material';

const Logos = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexWrap: 'wrap',
				color:'black',
				backgroundColor:'#D9D9D9',
				borderBottom: '3px solid #e20e0e',
				height:'100px'
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
						height: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						gap: '5px'
					}}
				>
					<Link href="https://www.unam.mx" target="_blank">
                            <Image src = {'/LogoUNAM.png'} width={85} height={95} alt="..." title='UNAM'/>
                    </Link>
					<Link href="https://www.ingenieria.unam.mx/"  target="_blank">
                            <Image src = {'/LogoFI.png'} width={85} height={95} alt="..." title='Facultad de Ingeniería'/>
                    </Link>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
						<Link
							href="https://www.ingenieria.unam.mx/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            underline="none" 
                            color="inherit"
							title='Facultad de Ingeniería'
						>
						<Typography
							sx={{
								fontFamily: 'sans-serif',
								fontWeight: 'normal',
								fontSize: '20px',
								color: 'primary.main',
								mb: -1
							}}
						>
							Facultad de
						</Typography>
						<Typography
							sx={{
								fontWeight: 'bolder',
								fontSize: '28px',
								color: 'primary.main',
								mt: -0.5
							}}
						>
							Ingeniería
						</Typography>
						</Link>
					</Box>
				</Grid>

				<Grid size={6}
					sx={{
						//border:'2px solid green',
						height: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Image src = {'/Logonuevo.png'} width={110} height={100} alt="..."/>
					<Image src = {'/LetrasEMUSHI.png'} width={300} height={50} alt="..."/>
				</Grid>
			</Grid>
		</Box>
	);
}

export default Logos;