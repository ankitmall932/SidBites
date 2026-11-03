import { getAddresses } from "@/app/actions/user/addressAction";
import CartCheckout from "@/components/Cart/CartCheckout";

export default async function CartPage ()
{
    const response = await getAddresses();

    return (
        <CartCheckout
            addresses={ response.success ? response.data : [] }
            addressError={ response.success ? null : response.message }
        />
    );
}
