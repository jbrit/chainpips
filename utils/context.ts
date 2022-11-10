import React from "react";

type AppContext = {
  currentPair: string;
  setCurrentPair: (pair: string) => void;
};

const AppContext = React.createContext<AppContext>({
  currentPair: "EURUSD",
  setCurrentPair: () => {},
});

export const AppContextProvider = AppContext.Provider;
export const useAppContext = () => React.useContext(AppContext);
