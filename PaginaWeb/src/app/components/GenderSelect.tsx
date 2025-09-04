import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const GenderMenu = ({ gender, handleGender }) => {
	return (
		<FormControl sx={{ width: '125px'}}>
			<InputLabel sx={{ color: 'black' }}>Género</InputLabel>
			<Select
				label='Género'
				value={gender}
				autoWidth
				onChange={(e) => {
					handleGender(e);
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
				<MenuItem value={'M'}
					sx={{
						borderBottom: '1px solid',
						borderColor: 'secondary.main',
					}}
				> Masculino </MenuItem>
				<MenuItem value={'F'}
					sx={{
						borderBottom: '1px solid',
						borderColor: 'secondary.main',
					}}
				> Femenino </MenuItem>
				<MenuItem value={'N'}
					sx={{
						borderBottom: '1px solid',
						borderColor: 'secondary.main',
					}}
				> Neutro </MenuItem>
			</Select>
		</FormControl>
	);
};

export default GenderMenu;