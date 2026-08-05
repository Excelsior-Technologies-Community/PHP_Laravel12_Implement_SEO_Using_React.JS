import React, { createContext, useContext, useEffect, useState } from 'react';

const CompareContext = createContext();

const MAX_COMPARE = 4;

export function CompareProvider({ children }) {
    const [compareList, setCompareList] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('compareList');
        if (saved) {
            setCompareList(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('compareList', JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (product) => {
        if (compareList.length >= MAX_COMPARE) {
            alert(`You can compare up to ${MAX_COMPARE} products.`);
            return false;
        }
        if (compareList.some(p => p.id === product.id)) {
            alert('Product already in comparison list.');
            return false;
        }
        setCompareList([...compareList, product]);
        return true;
    };

    const removeFromCompare = (id) => {
        setCompareList(compareList.filter(p => p.id !== id));
    };

    const clearCompare = () => {
        setCompareList([]);
    };

    const isInCompare = (id) => {
        return compareList.some(p => p.id === id);
    };

    return (
        <CompareContext.Provider
            value={{
                compareList,
                addToCompare,
                removeFromCompare,
                clearCompare,
                isInCompare,
                compareCount: compareList.length,
                maxCompare: MAX_COMPARE,
            }}
        >
            {children}
        </CompareContext.Provider>
    );
}

export const useCompare = () => useContext(CompareContext);
