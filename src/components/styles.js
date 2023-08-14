const stylesBook = {
  eventCard: [
    'border', 'rounded-2xl', 'shadow-lg', 'pb-6'
  ],
  orderHeader: [
    'bg-slate-600', 'text-white'
  ],
};

export function useStyle(type) {
  if (typeof type === 'string') {
    return stylesBook[type];
  } else if (Array.isArray(type)) {
    return type
      .map(t => stylesBook[t])
      .flat();
  }

  const allStyles = stylesBook.map(t => stylesBook[t]);
  return allStyles.flat();
}
