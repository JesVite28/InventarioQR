import React, { createContext, useState, useContext, ReactNode } from 'react';

interface BarcodeContextType {
    barcode: string;
    setBarcode: (barcode: string) => void;
}

const BarcodeContext = createContext<BarcodeContextType | undefined>(undefined);

export const BarcodeProvider = ({ children }: { children: ReactNode }) => {
    const [barcode, setBarcode] = useState<string>('');

    return (
        <BarcodeContext.Provider value={{ barcode, setBarcode }}>
            {children}
        </BarcodeContext.Provider>
    );
};

export const useBarcode = (): BarcodeContextType => {
    const context = useContext(BarcodeContext);
    if (!context) {
        throw new Error('UseBarCode No esta funcionando');
    }
    return context;
};