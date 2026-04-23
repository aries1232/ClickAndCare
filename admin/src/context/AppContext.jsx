import { createContext } from 'react';
import { slotDateFormat, calculateAge } from '../utils/dateUtils';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const value = { slotDateFormat, calculateAge };
  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
