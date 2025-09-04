import { useEffect, useState } from "react";
import useDischarges from "./useDischarges";

const useDischargeFilters = () => {
    interface Filters {
        school: string;
        building: string;
        floor: string;
        type: string;
        gender: string;
        startDate: string;
        endDate: string;
    }
    interface Discharge {
        dischargeID: string;
        name: string;
        building: string;
        floor: string;
        gender: string;
        formatedDate: string;
        heatmapFormatedDate: string;
        formatedTime: string;
        type: string;
        mlPerUse: string;
    }

    const [status, setStatus] =useState(102)
    const [filters, setFilters] = useState<Filters>({school: '', building: '', floor: '', type: '', gender: '', startDate: '', endDate: ''});
    const {rows, setRows} = useDischarges();
    useEffect(()=>{
        const fetchFilteredData = async () => {
        try {
        const response = await fetch('/api/mysql/filteredDischarges', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(filters),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData: Discharge[] = await response.json();
        if (responseData.length > 0) setStatus(200);
        else setStatus(400);
        console.log('status'+status)
        setRows(responseData);
        } catch (error) {
        console.error("Error fetching or sending data:", error);
        }
    };
    fetchFilteredData();
    },[])
    
    return {status, rows, filters, setFilters}
}

export default useDischargeFilters;