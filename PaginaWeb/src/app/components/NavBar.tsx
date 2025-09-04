import Toolbar from '@mui/material/Toolbar'
import { Button } from '@mui/material';
import { navItems } from '../constants/navbar';
import Link from 'next/link';

const NavBar = () => {
	return (
		<Toolbar sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', borderBottom:'3px solid #e20e0e' }}>
			{navItems.map((item) => (
				<Button
					key={item.label}
					component={Link}
					href={item.path}
					sx={{
						backgroundColor: 'transparent',
						color: '#000000',
						'&:hover': {
							color: 'primary.main'
						},
					}}
				>
					{item.label}
				</Button>
			))}
		</Toolbar>
	);
 }

export default NavBar;