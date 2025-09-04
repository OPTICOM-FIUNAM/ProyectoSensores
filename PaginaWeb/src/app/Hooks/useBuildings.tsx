import { useEffect, useState } from 'react';

const useBuildings = ( school ) => {
	const [buildings, setBuildings] = useState<string[]>([]);

	useEffect(() => {
		async function fetchBuildings() {
			const data = await fetch(`../api/mysql/buildings?school=${encodeURIComponent(school)}`);
			const response = await data.json();
			handleBuildings(response);
		};
		fetchBuildings();
	}, [ school ]);

	const handleBuildings = (newBuildings: { building: string }[]) => {
		const buildingList = newBuildings.map(b => b.building);
		setBuildings(buildingList);
	};

	return { buildings, handleBuildings };
};

export default useBuildings;