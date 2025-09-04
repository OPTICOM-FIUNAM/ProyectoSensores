import { useEffect, useState } from "react";

const useDischarges = () => {
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
    const [rows, setRows] = useState<Discharge[]>([]);
    
    
    
    return {rows, setRows}
    
}

export default useDischarges;