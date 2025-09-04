import { SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

const useBuilding = () => {
	const [building, setBuilding] = useState('');
	const handleBuilding = (event: SelectChangeEvent) => setBuilding(event.target.value);
	const resetBuilding = () => setBuilding('');
	return { building, handleBuilding, resetBuilding };
};

export default useBuilding;