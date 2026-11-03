import { getDiscountedPrice } from "@/lib/utils/pricing";

type Props = {
    price: string | number;
    discount: string | number | null;
    quantity?: number;
    className?: string;
};

export default function DiscountedPrice ( { price, discount, quantity = 1, className = "" }: Props )
{
    const { originalPrice, discountedPrice, hasDiscount } = getDiscountedPrice( price, discount );

    return (
        <span className={ `inline-flex flex-wrap items-center gap-x-1.5 ${ className }` }>
            { hasDiscount && (
                <span className="text-stone-500 line-through dark:text-stone-400">
                    ₹{ ( originalPrice * quantity ).toFixed( 2 ) }
                </span>
            ) }
            <span className={ hasDiscount ? "font-bold text-orange-700 dark:text-orange-300" : "" }>
                ₹{ ( discountedPrice * quantity ).toFixed( 2 ) }
            </span>
        </span>
    );
}
