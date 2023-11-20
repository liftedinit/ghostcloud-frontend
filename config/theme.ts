import {extendTheme} from '@chakra-ui/react';

const primaryColors = {
  '50': '#F7FAFC',
  '100': '#EDF2F7',
  '200': '#E2E8F0',
  '300': '#CBD5E0',
  '400': '#A0AEC0',
  '500': '#718096',
  '600': '#4A5568',
  '700': '#2D3748',
  '800': '#1A202C',
  '900': '#171923'
}
export const defaultThemeObject = {
  fonts: {
    body: 'Inter, system-ui, sans-serif',
    heading: 'Work Sans, system-ui, sans-serif'
  },
  colors: {
    primary: primaryColors,
    modes: {
      light: {
        background: primaryColors['50'],
        altBackground: primaryColors['200'],
        text: primaryColors['900'],
      },
      dark: {
        background: primaryColors['900'],
        altBackground: primaryColors['700'],
        text: primaryColors['50'],
      },
    },
  },
  breakPoints: {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em'
  },
  shadows: {
    largeSoft: 'rgba(60, 64, 67, 0.15) 0px 2px 10px 6px;'
  },
  config: {
    initialColorMode: 'light', // Set default color mode to light
    useSystemColorMode: false, // Disable automatic color mode based on system preference. TODO: Remove this
  },
};

export const defaultTheme = extendTheme(defaultThemeObject);
