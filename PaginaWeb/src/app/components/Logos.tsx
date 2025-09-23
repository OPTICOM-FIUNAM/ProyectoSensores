import Image from 'next/image';

import { Box, Grid, Typography } from '@mui/material';

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
					<Image src = {'/LogoUNAM.png'} width={85} height={95} alt="..."/>
					<Image src = {'/LogoFI.png'} width={85} height={95} alt="..."/>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
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
					</Box>
				</Grid>

				<Grid size={6}
					sx={{
						//border:'2px solid green',
						height: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						gap: '15px'
					}}
				>
					<Image src = {'/Logonuevo.png'} width={110} height={110} alt="..."/>
					<Image src = {'/LETRASOPTICOM.png'} width={300} height={50} alt="..."/>
				</Grid>
			</Grid>
		</Box>
	);
}

export default Logos;