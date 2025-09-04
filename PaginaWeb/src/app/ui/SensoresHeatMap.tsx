import { Tooltip } from "@mui/material";
import HeatMap, { HeatMapValue } from "@uiw/react-heat-map";

const SensoresHeatMap = ({heatmapData}) => {
    return (
        <HeatMap
          width={1200}
          height={200}
          style={{ color: '#000000'}}
          panelColors={['#E3E5F1', '#FAD5D6', '#F6AAAD', '#F18085', '#EC565C', '#E72C33']}
          value={heatmapData}
          weekLabels={['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']}
          monthLabels={['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']}
          startDate={new Date('2025/01/01')}
          rectSize={20}
          rectRender={(props, data) => {
            let displayDate = data.date;
            try {
                const parts = data.date.split('/');
                if (parts.length === 3) {
                    const year = parts[0];
                    const month = parts[1];
                    const day = parts[2];
                    displayDate = `${day}/${month}/${year}`;              }
            } catch (e) {
                console.error("Error formatting date for tooltip:", e);
            }
            const tooltipContent = (
              <>
                <div>Fecha: {displayDate}</div>
                <div>Descargas: {data.count || 0}</div>
              </>
            );
            return (
              <Tooltip title= {tooltipContent} placement='top' arrow>
                <rect {...props}/>
              </Tooltip>
            );
          }}
        />
    );
}

export default SensoresHeatMap;