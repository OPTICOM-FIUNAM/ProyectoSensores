import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SchoolMenu = ({ school, handleSchool, schools, resetBuilding, resetFloor }) => {
	return (
		<FormControl sx={{ width: '250px' }}>
			<InputLabel sx={{ color: 'black' }}>Escuela</InputLabel>
			<Select
				label='Escuela'
				value={school}
				autoWidth
				onChange={(e) => {
					handleSchool(e);
					resetBuilding();
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
					maxWidth: '250px',
					padding: '0px',
				}}
			>
				<MenuItem value={''}
					sx={{
						borderBottom: '1px solid',
						borderColor: 'secondary.main',
					}}
				> Cualquiera </MenuItem>
				{schools.map((schol) => (
					<MenuItem value={schol}
						sx={{
							whiteSpace: 'normal',
							wordWrap: 'break-word',
							maxWidth: '225px',
							borderBottom: '1px solid',
							borderColor: 'secondary.main',
						}}
					>
						{schol}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default SchoolMenu;