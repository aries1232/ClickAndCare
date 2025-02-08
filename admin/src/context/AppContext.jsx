import { createContext } from "react";


export const AppContext = createContext();

const AppContextProvider = (props) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (dateFormat) => {
    const dateArray = dateFormat.split("_");
    return (
      " " +
      dateArray[0] +
      " " +
      months[parseInt(dateArray[1]) - 1] +
      " " +
      dateArray[2]
    );
  };

  const calculateAge = (dob) => {
    const today = new Date();
    //console.log(today);
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();

    return age;
  };

  const value = {
    calculateAge,slotDateFormat
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
