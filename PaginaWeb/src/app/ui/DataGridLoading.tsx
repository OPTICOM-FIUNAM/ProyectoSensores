import { Box, CircularProgress, Typography } from "@mui/material";

export default function DataGridSkeleton({height}) {
    return (
        <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height={height}
      >
        <CircularProgress color="primary" />
        <Typography variant="body2" mt={2}>
          Cargando datos
        </Typography>
      </Box>
    );
}