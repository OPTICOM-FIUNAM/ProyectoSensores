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
						gap: '15px'
					}}
				>
					<Image src = {'/LogoUNAM.png'} width={80} height={80} alt="..."/>
					<Typography
						sx={{
							fontWeight: 'bold'
						}}
					>
						Universidad Nacional <br/> Autónoma México
					</Typography>
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
					<Typography
						sx={{
							fontWeight: 'bold',
							color: 'primary.main'
						}}
					>
						Facultad de Ingeniería
					</Typography>
					<Image src = {'/LogoFI.png'} width={80} height={85} alt="..."/>
				</Grid>
			</Grid>
		</Box>
	);
}

export default Logos;