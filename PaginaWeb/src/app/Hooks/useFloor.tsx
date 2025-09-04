import { SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

const useFloor = () => {
	const [floor, setFloor] = useState('');
	const handleFloor = (event: SelectChangeEvent) => setFloor(event.target.value);
	const resetFloor = () => setFloor('');
	return { floor, handleFloor, resetFloor };
};

export default useFloor;