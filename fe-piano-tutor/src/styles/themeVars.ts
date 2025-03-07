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
    primary: '#432FC7', // Vibrant deep purple
    secondary: '#00BCD4', // Bright cyan-blue
    success: '#8BC34A',
    warning: '#FFC107',
    error: '#F44336',

    primaries: {
      300: '#8576E8', // Lighter, soft lavender purple
      500: '#432FC7', // Main bold purple
      900: '#2A1E85'  // Deep, rich purple
    },

    secondaries: {
      300: '#6EE7F7', // Softer sky cyan
      500: '#00BCD4', // Main bright cyan-blue
      900: '#00869B'  // Darker, ocean cyan
    },

    successes: {
      300: '#AED581', // Softer green
      500: '#8BC34A', // Main success green
      900: '#558B2F'  // Deep forest green
    },

    warnings: {
      300: '#FFE082', // Lighter warm yellow
      500: '#FFC107', // Main alert yellow
      900: '#FF8F00'  // Deeper warm amber
    },

    errors: {
      300: '#E57373', // Softer red
      500: '#F44336', // Main danger red
      900: '#B71C1C'  // Deep red alert
    },

    gray: {
      100: '#F4F4F9', // Slightly cool white
      200: '#E9E9F2', // Soft light gray with indigo hue
      300: '#D8D8E6', // Subtle bluish-gray
      400: '#B6B6D0', // Muted soft indigo-gray
      500: '#9696B8', // Balanced gray with indigo undertone
      600: '#6F6F98', // Deeper gray with more indigo
      700: '#5A5A7F', // Darker indigo-tinted gray
      800: '#3F3F5E', // Richer, shadowy indigo-gray
      900: '#212138'  // Deep, moody dark indigo-gray
    },

    background: '#EAF5FF', // Soft dreamy blue background
    text: '#3D3D5C' // Slightly muted dark grayish indigo
  },
  fonts: {
    primary: '"Mona Sans", sans-serif',
    music: 'Noto Music, sans-serif'
  },
  fontWeights: {
    light: 200,
    regular: 400,
    bold: 600
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
