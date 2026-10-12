import React, { useState } from "react";

const useFormFields = (initialValue = {}) => {
  const [fields, setFields] = useState(initialValue);
  const handleChange = (e) => {
    const { target } = e;
    setFields({...fields, [target.name]: target.value}) 
  };
  return [fields, handleChange, setFields];
};
export default useFormFields;
