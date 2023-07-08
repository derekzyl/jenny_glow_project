import React, { useState } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

function CheckboxList() {
  const [selectAll, setSelectAll] = useState(false);
  const [checkboxes, setCheckboxes] = useState([
    { id: 1, checked: false },
    { id: 2, checked: false },
    { id: 3, checked: false },
  ]);

  const toggleCheckboxes = () => {
    const updatedCheckboxes = checkboxes.map((checkbox) => ({
      ...checkbox,
      checked: !selectAll,
    }));
    setCheckboxes(updatedCheckboxes);
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id: any) => {
    const updatedCheckboxes = checkboxes.map((checkbox) => {
      if (checkbox.id === id) {
        return {
          ...checkbox,
          checked: !checkbox.checked,
        };
      }
      return checkbox;
    });
    setCheckboxes(updatedCheckboxes);
    const allChecked = updatedCheckboxes.every((checkbox) => checkbox.checked);
    setSelectAll(allChecked);
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={selectAll} onChange={toggleCheckboxes} />}
        label="Select All"
      />
      {checkboxes.map((checkbox) => (
        <FormControlLabel
          key={checkbox.id}
          control={
            <Checkbox
              checked={checkbox.checked}
              onChange={() => handleCheckboxChange(checkbox.id)}
            />
          }
          label={`Checkbox ${checkbox.id}`}
        />
      ))}
    </FormGroup>
  );
}

export default CheckboxList;
