import 'styled-components'
import {DefaultTheme} from 'styled-components'

// Augment the DefaultTheme interface to match your theme structure
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof themeVars.colors;
    fonts: typeof themeVars.fonts;
    fontWeights: typeof themeVars.fontWeights;
    breakpoints: typeof themeVars.breakpoints;
    spacing: typeof themeVars.spacing;
  }
}

const themeVars = {
  colors: {
    primary: '#673ab7',
    success: '#388e3c',
    warning: '#ffc107',
    error: '#f44336',
    primaries: {
      300: '#B39DDB',
      500: '#673AB7',
      900: '#311b92'
    },
    successes: {
      300: '#81C784',
      500: '#388e3c',
      900: '#1b5e20'
    },
    warnings: {
      300: '#FFD54F',
      500: '#FFC107',
      900: '#ff6f00'
    },
    errors: {
      300: '#e57373',
      500: '#f44336',
      900: '#b71c1c'
    },
    gray: {
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121'
    },
    background: '#ffffff',
    text: '#333333'
  },
  fonts: {
    primary: 'Spectral, serif',
    music: 'Noto Music, sans-serif'
  },
  fontWeights: {
    light: 300,
    regular: 400,
    bold: 700
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '1024px'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  }
} as const

export const materialColors = [
  '#f44336', // Red
  '#e91e63', // Pink
  '#9c27b0', // Purple
  '#673ab7', // Deep Purple
  '#3f51b5', // Indigo
  '#2196f3', // Blue
  '#03a9f4', // Light Blue
  '#00bcd4', // Cyan
  '#009688', // Teal
  '#4caf50', // Green
  '#8bc34a', // Light Green
  '#cddc39', // Lime
  '#ffeb3b', // Yellow
  '#ffc107', // Amber
  '#ff9800', // Orange
  '#ff5722' // Deep Orange
]


export default themeVars
