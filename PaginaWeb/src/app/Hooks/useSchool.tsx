import { SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

const useSchool = () => {
	const [school, setSchool] = useState('');
	const handleSchool = (event: SelectChangeEvent) => setSchool(event.target.value);
	return { school, handleSchool };
};

export default useSchool;