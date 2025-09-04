import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const BuildingMenu = ({ building, handleBuilding, buildings, resetFloor }) => {
	return (
		<FormControl sx={{ width: '125px'}}>
			<InputLabel sx={{ color: 'black' }}>Edificio</InputLabel>
			<Select
				label='Edificio'
				value={building}
				autoWidth
				onChange={(e) => {
					handleBuilding(e);
					resetFloor();
				}}
				sx={{
					color: 'black',
					'& .MuiOutlinedInput-notchedOutline': {
						borderColor: 'secondary.main',
						borderWidth: '2px',
					},
					'&:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: 'primary.main',
					},
					'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
						borderColor: 'primary.main',
					},
				}}
			>
				<MenuItem value={''}
					sx={{
						borderBottom: '1px solid',
						borderColor: 'secondary.main',
					}}
				> Cualquiera </MenuItem>
				{buildings.map((buildin) => (
					<MenuItem value={buildin}
						sx={{
							borderBottom: '1px solid',
							borderColor: 'secondary.main',
						}}
					>Edificio {buildin} </MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default BuildingMenu;