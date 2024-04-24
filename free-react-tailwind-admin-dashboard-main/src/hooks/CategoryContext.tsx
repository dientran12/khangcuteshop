import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Category } from '../types/category';
import * as Api from '../ApiService';

interface CategoryProviderProps {
    children: ReactNode;
}

interface CategoryContextType {
    categories: Category[];
    addCategory: (category: Category) => void;
    deleteCategory: (name: string) => void;
    fetchCategories: () => void;
}

const CategoryContext = createContext<CategoryContextType>({
    categories: [],
    addCategory: () => { },
    deleteCategory: () => { },
    fetchCategories: () => { }
});

export const useCategories = () => useContext(CategoryContext);

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await Api.getAllCategory();
            const data: Category[] = response;
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const addCategory = useCallback((newCategory: Category) => {
        setCategories(prev => [...prev, newCategory]);
        // You may also choose to refresh the list from the server
    }, []);

    const deleteCategory = useCallback((name: string) => {
        setCategories(prev => prev.filter(cat => cat.name !== name));
        // Optionally, refresh from the server
    }, []);

    return (
        <CategoryContext.Provider value={{ categories, addCategory, deleteCategory, fetchCategories }}>
            {children}
        </CategoryContext.Provider>
    );
};
