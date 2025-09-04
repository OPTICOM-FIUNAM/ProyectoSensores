import { SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

const useGender = () => {
	const [gender, setGender] = useState('');
	const handleGender = (event: SelectChangeEvent) => setGender(event.target.value);
	const resetGender = () => setGender('');
	return { gender, handleGender, resetGender };
};

export default useGender;