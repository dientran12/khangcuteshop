import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
    isLoading: boolean;
    showLoading: () => void;
    hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    showLoading: () => { },
    hideLoading: () => { }
});

interface LoadingProviderProps {
    children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [isLoading, setLoading] = useState<boolean>(false);

    const showLoading = () => setLoading(true);
    const hideLoading = () => setLoading(false);

    return (
        <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

// Custom hook để sử dụng context
export const useLoading = (): LoadingContextType => useContext(LoadingContext);
