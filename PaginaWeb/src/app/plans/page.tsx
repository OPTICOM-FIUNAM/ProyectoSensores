'use client'

import { Box, Button } from '@mui/material';

import useBuilding from "../Hooks/useBuiding";
import useBuildings from "../Hooks/useBuildings";
import useSchools from "../Hooks/useSchools";
import useSchool from "../Hooks/useSchool";
import useFloor from "../Hooks/useFloor";
import useFloors from "../Hooks/useFloors";
import useGender from "../Hooks/useGender";

import BuildingMenu from "../components/BuildingSelect"
import SchoolMenu from "../components/SchoolsSelect";
import FloorMenu from "../components/FloorSelect";
import GenderMenu from "../components/GenderSelect";

export default function Plan() {

	const { school, handleSchool } = useSchool();
	const { schools, handleSchools } = useSchools();
	const { building, handleBuilding, resetBuilding } = useBuilding();
	const { buildings, handleBuildings } = useBuildings(school);
	const { floor, handleFloor, resetFloor } = useFloor();
	const { floors, handleFloors } = useFloors({building,school});
	const { gender, handleGender } = useGender();

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				flexWrap: 'wrap',
				padding: '10px',
				gap: '25px',
			}}
		>
			<SchoolMenu school={school} handleSchool={handleSchool} schools={schools} resetBuilding={resetBuilding} resetFloor={resetFloor} />
			<BuildingMenu building={building} handleBuilding={handleBuilding} buildings={buildings} resetFloor={resetFloor} />
			<FloorMenu floor={floor} handleFloor={handleFloor} floors={floors} />
			<GenderMenu gender={gender} handleGender={handleGender} />
		</Box>
	);
};