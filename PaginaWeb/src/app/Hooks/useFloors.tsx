import { useEffect, useState } from 'react';

const useFloors = ( {building, school} ) => {
	const [floors, setFloors] = useState<string[]>([]);

	useEffect(() => {
		async function fetchFloors() {
			const data = await fetch(`../api/mysql/floors?building=${encodeURIComponent(building)}&school=${encodeURIComponent(school)}`);
			const response = await data.json();
			handleFloors(response);
		};
		fetchFloors();
	}, [ building, school ]);

	const handleFloors = (newFloors: { floor: string }[]) => {
		const floorList = newFloors.map(b => b.floor);
		setFloors(floorList);
	};

	return { floors, handleFloors };
};

export default useFloors;