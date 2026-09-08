export const formatCurrency = (
    amountInCents: number,
    currency: string = 'USD',
    locale: string = 'en-US',
): string => {
    // Convert cents back to flat decimal right at the visual layer
    const realAmount = amountInCents / 100;

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(realAmount);
};
