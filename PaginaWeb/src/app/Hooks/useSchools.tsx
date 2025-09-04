import { useEffect, useState } from 'react';

const useSchools = () => {
	const [schools, setSchools] = useState<string[]>([]);

	useEffect(() => {
		async function fetchSchools() {
			const data = await fetch('../api/mysql/schools');
			const response = await data.json();
			handleSchools(response);
		};
		fetchSchools();
	}, []);

	const handleSchools = (newSchools: { name: string }[]) => {
		const schoolList = newSchools.map(b => b.name);
		setSchools(schoolList);
	};

	return { schools, handleSchools };
};

export default useSchools;