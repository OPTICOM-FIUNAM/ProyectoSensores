'use client'
import { createTheme } from '@mui/material';
import { purple } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      	main: '#E20E0E',
    },
    secondary: {
		main: '#E3E5F1',
    },
    background: {
		default: '#F5F5F5',
    },
  },
});