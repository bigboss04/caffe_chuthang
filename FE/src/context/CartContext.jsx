import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingIndex = state.items.findIndex(
                item => item.id === action.payload.id && item.variantLabel === action.payload.variantLabel
            );
            if (existingIndex >= 0) {
                const updatedItems = [...state.items];
                updatedItems[existingIndex] = {
                    ...updatedItems[existingIndex],
                    quantity: updatedItems[existingIndex].quantity + (action.payload.quantity || 1),
                };
                return { ...state, items: updatedItems };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
            };
        }
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(
                    item => !(item.id === action.payload.id && item.variantLabel === action.payload.variantLabel)
                ),
            };
        case 'UPDATE_QUANTITY': {
            if (action.payload.quantity <= 0) {
                return {
                    ...state,
                    items: state.items.filter(
                        item => !(item.id === action.payload.id && item.variantLabel === action.payload.variantLabel)
                    ),
                };
            }
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id && item.variantLabel === action.payload.variantLabel
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };
        }
        case 'CLEAR_CART':
            return { ...state, items: [] };
        case 'TOGGLE_CART':
            return { ...state, isOpen: !state.isOpen };
        case 'CLOSE_CART':
            return { ...state, isOpen: false };
        default:
            return state;
    }
};

const getInitialState = () => {
    try {
        const saved = localStorage.getItem('cart_items');
        return {
            items: saved ? JSON.parse(saved) : [],
            isOpen: false,
        };
    } catch {
        return { items: [], isOpen: false };
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, getInitialState());

    useEffect(() => {
        localStorage.setItem('cart_items', JSON.stringify(state.items));
    }, [state.items]);

    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const addItem = (product, variant, quantity = 1) => {
        dispatch({
            type: 'ADD_ITEM',
            payload: {
                id: product.id,
                name: product.name,
                slug: product.slug,
                image: product.image,
                price: variant ? variant.price : product.price,
                variantLabel: variant ? variant.label : product.unit,
                categoryLabel: product.categoryLabel || (typeof product.category === 'object' ? product.category?.name : product.category) || '',
                quantity,
            },
        });
    };

    const removeItem = (id, variantLabel) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { id, variantLabel } });
    };

    const updateQuantity = (id, variantLabel, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, variantLabel, quantity } });
    };

    const clearCart = () => dispatch({ type: 'CLEAR_CART' });
    const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
    const closeCart = () => dispatch({ type: 'CLOSE_CART' });

    return (
        <CartContext.Provider
            value={{
                items: state.items,
                isOpen: state.isOpen,
                totalItems,
                totalPrice,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                toggleCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
