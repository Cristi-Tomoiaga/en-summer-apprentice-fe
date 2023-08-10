const stylesBook = {
    eventCard: [
        'border', 'rounded-2xl', 'pb-6', 'w-3/4', 'shadow-lg', 'm-4', 'lg:w-1/4'
    ]
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
