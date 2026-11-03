export function getDiscountedPrice ( price: string | number, discount: string | number | null )
{
    const originalPrice = Number( price );
    const discountPercent = Math.min( 100, Math.max( 0, Number( discount ) || 0 ) );
    const discountedPrice = Math.round( originalPrice * ( 1 - discountPercent / 100 ) * 100 ) / 100;

    return {
        originalPrice,
        discountedPrice,
        hasDiscount: discountPercent > 0
    };
}
