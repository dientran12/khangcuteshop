import React from 'react';
import { HashLoader } from 'react-spinners';
import { useLoading } from '../../hooks/LoadingContext';

const Loading: React.FC = () => {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
        }}>
            <HashLoader
                color="blue"
                loading={true}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
};

export default Loading;
