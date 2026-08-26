import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {

    const [wishlist, setWishlist] = useState([]);

    /*
    |--------------------------------------------------------------------------
    | LOAD WISHLIST
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const saved =
            localStorage.getItem("wishlist");

        if (saved) {

            try {

                setWishlist(
                    JSON.parse(saved)
                );

            } catch (error) {

                console.error(
                    "Invalid wishlist data:",
                    error
                );

                localStorage.removeItem(
                    "wishlist"
                );
            }
        }

    }, []);

    /*
    |--------------------------------------------------------------------------
    | SAVE WISHLIST
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

    }, [wishlist]);

    /*
    |--------------------------------------------------------------------------
    | TOGGLE WISHLIST
    |--------------------------------------------------------------------------
    */

    const toggleWishlist = (product) => {

        setWishlist(currentWishlist => {

            const exists =
                currentWishlist.some(
                    item =>
                        item.id === product.id
                );

            if (exists) {

                return currentWishlist.filter(
                    item =>
                        item.id !== product.id
                );
            }

            return [
                ...currentWishlist,
                product
            ];
        });
    };

    /*
    |--------------------------------------------------------------------------
    | REMOVE
    |--------------------------------------------------------------------------
    */

    const removeFromWishlist = (id) => {

        setWishlist(currentWishlist =>
            currentWishlist.filter(
                item =>
                    item.id !== id
            )
        );
    };

    /*
    |--------------------------------------------------------------------------
    | CLEAR
    |--------------------------------------------------------------------------
    */

    const clearWishlist = () => {

        setWishlist([]);

    };

    /*
    |--------------------------------------------------------------------------
    | CHECK
    |--------------------------------------------------------------------------
    */

    const isInWishlist = (id) => {

        return wishlist.some(
            item => item.id === id
        );
    };

    return (

        <WishlistContext.Provider
            value={{
                wishlist,
                toggleWishlist,
                removeFromWishlist,
                clearWishlist,
                isInWishlist,
                wishlistCount:
                    wishlist.length
            }}
        >

            {children}

        </WishlistContext.Provider>
    );
}

export const useWishlist = () =>
    useContext(WishlistContext);