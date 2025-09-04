import { useEffect, useState } from "react";
import useDischargeFilters from "./useDischargeFilters";


const useHeatmapData = (rows) => {
    interface HeatmapValue {
        date: string;
        count: number;
    }

    const [heatmapData, setHeatmapData] = useState<HeatmapValue[]>([]);

    useEffect(() => {
        if (rows.length > 0) {
        const newHeatmapData: { [key: string]: number } = {};
        rows.forEach(discharge => {
            const originalDate = discharge.heatmapFormatedDate;
            let formattedDate: string | null = null;
            try {
            const dateParts = originalDate.split('/');
            if (dateParts.length === 3) {
                const year = dateParts[0];
                const month = dateParts[1].padStart(2, '0');
                const day = dateParts[2].padStart(2, '0');
                formattedDate = `${year}/${month}/${day}`;
            }
            } catch (e) {
            console.error(`Error parsing date '${originalDate}':`, e);
            formattedDate = null;
            }

            if (formattedDate) {
            newHeatmapData[formattedDate] = (newHeatmapData[formattedDate] || 0) + 1;
            } else {
            console.warn(`Skipping dischargeID: ${discharge.dischargeID} due to invalid or unparsable formatedDate: '${originalDate}'`);
            }
        });

        const finalHeatmapData: HeatmapValue[] = Object.keys(newHeatmapData).map(date => ({
            date,
            count: newHeatmapData[date],
        }));
        setHeatmapData(finalHeatmapData);
        } else {
        setHeatmapData([]);
        }
    }, [rows]);
    console.log(rows)
    console.log(heatmapData)
    return heatmapData;
}

export default useHeatmapData;