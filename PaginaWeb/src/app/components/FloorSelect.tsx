import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const FloorMenu = ({ floor, handleFloor, floors }) => {
	return (
		<FormControl sx={{ width: '125px'}}>
			<InputLabel sx={{ color: 'black' }}>Piso</InputLabel>
			<Select
				label='Piso'
				value={floor}
				autoWidth
				onChange={(e) => {
					handleFloor(e);
				}}
				sx={{
					color:'black',
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
				{floors.map((floor) =>
					(floor === 0
					? (<MenuItem key={floor} value={floor}
							sx={{
								borderBottom: '1px solid',
								borderColor: 'secondary.main',
							}}
						>Planta Baja</MenuItem>)
						: (<MenuItem key={floor} value={floor}
							sx={{
								borderBottom: '1px solid',
								borderColor: 'secondary.main',
							}}
						>Piso {floor}</MenuItem>)
					)
				)}
			</Select>
		</FormControl>
	);
};

export default FloorMenu;