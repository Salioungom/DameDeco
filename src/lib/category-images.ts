// Images SVG pour les catégories
const createCategorySVG = (icon: string, color: string) => {
  const icons: Record<string, string> = {
    sheets: 'M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z',
    curtains: 'M3 3v18h2V5h16v16h2V3H3zm4 14h2V7H7v10zm4 0h2V7h-2v10zm4 0h2V7h-2v10z',
    'prayer-mats': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    carpets: 'M4 6h16v12H4z M2 4v16h20V4H2zm6 2h8v2H8V6zm0 4h8v2H8v-2zm0 4h8v2H8v-2z',
    dialaber: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    furniture: 'M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z'
  };

  const path = icons[icon] || icons.sheets;
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="200" fill="${color}"/>
      <path d="${path}" fill="white" opacity="0.8" transform="translate(150, 70) scale(2)"/>
    </svg>
  `)}`;
};

export const categoryImages = {
  sheets: createCategorySVG('sheets', '#3b82f6'),
  curtains: createCategorySVG('curtains', '#10b981'), 
  'prayer-mats': createCategorySVG('prayer-mats', '#8b5cf6'),
  carpets: createCategorySVG('carpets', '#f59e0b'),
  dialaber: createCategorySVG('dialaber', '#ef4444'),
  furniture: createCategorySVG('furniture', '#6366f1')
};
