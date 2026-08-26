import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

    const [cart, setCart] = useState([]);

    /*
    |--------------------------------------------------------------------------
    | LOAD CART
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const savedCart = localStorage.getItem("cart");

        if (savedCart) {

            try {

                setCart(JSON.parse(savedCart));

            } catch (error) {

                console.error(
                    "Invalid cart data:",
                    error
                );

                localStorage.removeItem("cart");
            }
        }

    }, []);

    /*
    |--------------------------------------------------------------------------
    | SAVE CART
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    }, [cart]);

    /*
    |--------------------------------------------------------------------------
    | ADD TO CART
    |--------------------------------------------------------------------------
    */

    const addToCart = (product, quantity = 1) => {

        const requestedQuantity = Number(quantity);

        if (requestedQuantity < 1) {
            return false;
        }

        if (Number(product.stock_quantity) <= 0) {

            alert("This product is out of stock.");

            return false;
        }

        setCart(currentCart => {

            const existingProduct =
                currentCart.find(
                    item => item.id === product.id
                );

            if (existingProduct) {

                const newQuantity =
                    existingProduct.quantity +
                    requestedQuantity;

                if (
                    newQuantity >
                    Number(product.stock_quantity)
                ) {

                    alert(
                        `Only ${product.stock_quantity} items are available.`
                    );

                    return currentCart;
                }

                return currentCart.map(item =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: newQuantity
                        }
                        : item
                );
            }

            return [
                ...currentCart,
                {
                    ...product,
                    quantity: Math.min(
                        requestedQuantity,
                        Number(product.stock_quantity)
                    )
                }
            ];

        });

        return true;
    };

    /*
    |--------------------------------------------------------------------------
    | UPDATE QUANTITY
    |--------------------------------------------------------------------------
    */

    const updateQuantity = (id, quantity) => {

        const newQuantity = Number(quantity);

        setCart(currentCart =>
            currentCart.map(item => {

                if (item.id !== id) {
                    return item;
                }

                const maxStock =
                    Number(item.stock_quantity);

                return {
                    ...item,
                    quantity: Math.max(
                        1,
                        Math.min(
                            newQuantity,
                            maxStock
                        )
                    )
                };

            })
        );
    };

    /*
    |--------------------------------------------------------------------------
    | INCREASE QUANTITY
    |--------------------------------------------------------------------------
    */

    const increaseQuantity = (id) => {

        setCart(currentCart =>
            currentCart.map(item => {

                if (item.id !== id) {
                    return item;
                }

                if (
                    item.quantity >=
                    Number(item.stock_quantity)
                ) {

                    alert(
                        `Only ${item.stock_quantity} items are available.`
                    );

                    return item;
                }

                return {
                    ...item,
                    quantity: item.quantity + 1
                };

            })
        );
    };

    /*
    |--------------------------------------------------------------------------
    | DECREASE QUANTITY
    |--------------------------------------------------------------------------
    */

    const decreaseQuantity = (id) => {

        setCart(currentCart =>
            currentCart.map(item =>
                item.id === id
                    ? {
                        ...item,
                        quantity: Math.max(
                            1,
                            item.quantity - 1
                        )
                    }
                    : item
            )
        );
    };

    /*
    |--------------------------------------------------------------------------
    | REMOVE
    |--------------------------------------------------------------------------
    */

    const removeFromCart = (id) => {

        setCart(currentCart =>
            currentCart.filter(
                item => item.id !== id
            )
        );
    };

    /*
    |--------------------------------------------------------------------------
    | CLEAR
    |--------------------------------------------------------------------------
    */

    const clearCart = () => {

        setCart([]);

    };

    /*
    |--------------------------------------------------------------------------
    | TOTAL ITEMS
    |--------------------------------------------------------------------------
    */

    const cartCount = cart.reduce(
        (total, item) =>
            total + Number(item.quantity),
        0
    );

    /*
    |--------------------------------------------------------------------------
    | TOTAL PRICE
    |--------------------------------------------------------------------------
    */

    const cartTotal = cart.reduce(
        (total, item) =>
            total +
            Number(item.price) *
            Number(item.quantity),
        0
    );

    /*
    |--------------------------------------------------------------------------
    | CHECK PRODUCT
    |--------------------------------------------------------------------------
    */

    const isInCart = (id) => {

        return cart.some(
            item => item.id === id
        );
    };

    return (

        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateQuantity,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart,
                cartCount,
                cartTotal,
                isInCart
            }}
        >

            {children}

        </CartContext.Provider>

    );
}

export const useCart = () =>
    useContext(CartContext);