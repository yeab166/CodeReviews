'use client';
import { createContext, ReactNode, useContext, useState } from 'react'

interface BalanceProviderProps {
  children: ReactNode;
}
interface BalanceContextType {
  current: number;
  updateBalance: (amount: number) => void;
}

const BalanceContext= createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<BalanceProviderProps> = ({ children }) => {
  const [current, setBalance] = useState<number>(100)

    const updateBalance = (amount: number) => {
        setBalance(amount);
    };

    return (
        <BalanceContext.Provider value={{ current, updateBalance }}>
            {children}
        </BalanceContext.Provider>
    );
};



export const useBalance = () => useContext(BalanceContext);
