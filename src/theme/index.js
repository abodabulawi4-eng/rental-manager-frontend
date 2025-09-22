// src/theme/index.js

import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const styles = {
  global: (props) => ({
    body: {
      bg: '#0F172A', // الخلفية الأساسية: أزرق داكن شبه أسود
      color: '#E2E8F0', // النصوص الفاتحة
    },
  }),
};

const colors = {
  brand: {
    income: '#22C55E', // أخضر الإيرادات
    expense: '#EF4444', // أحمر المصاريف
    tenant: '#3B82F6', // أزرق المستأجرين
    alert: '#FACC15', // أصفر التنبيهات
    purple: '#9333EA', // لمسة بنفسجية
    
    // Gradient للأزرار
    buttonGradient: 'linear(to-r, #00C2D1, #9333EA)',
  },
  // الألوان الأساسية
  bg: '#0F172A',
  card: '#1E293B',
  text: {
    primary: '#FFFFFF', // عناوين بارزة
    secondary: '#E2E8F0', // نصوص فاتحة
  },
};

const components = {
  Card: {
    baseStyle: (props) => ({
      bg: mode('rgba(30, 41, 59, 0.7)', 'rgba(30, 41, 59, 0.7)')(props),
      backdropFilter: 'blur(10px)', // تأثير Glassmorphism
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.2s ease-in-out',
      _hover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  Button: {
    baseStyle: {
      borderRadius: 'full',
      fontWeight: 'bold',
      _hover: {
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      },
    },
    variants: {
      solid: (props) => ({
        bgGradient: colors.brand.buttonGradient,
        color: 'white',
        _hover: {
          bgGradient: 'linear(to-r, #00C2D1, #9333EA)',
          transform: 'translateY(-2px) scale(1.05)',
        },
      }),
    },
  },
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const customTheme = extendTheme({ styles, colors, components, config });

export default customTheme;