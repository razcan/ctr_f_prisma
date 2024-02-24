import { createContext } from "react";

interface CurrentContractIdContextType {
    contractId: number;
}

export const CurrentContractContext = createContext<CurrentContractIdContextType | null>(null);

