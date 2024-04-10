import React from "react";
import { Form } from "react-bootstrap";

const AttributesFilterComponent = ({ attrsFilter, setAttrsFromFilter }) => {
  const handleCheckboxChange = (filter, valueForKey, isChecked) => {
    setAttrsFromFilter((filters) => {
      let updatedFilters = [...filters];
      const index = updatedFilters.findIndex((item) => item.key === filter.key);

      if (index === -1 && isChecked) {
        // Add new filter key
        updatedFilters.push({ key: filter.key, values: [valueForKey] });
      } else if (index !== -1) {
        if (isChecked) {
          // Add new value to existing filter key
          updatedFilters[index].values.push(valueForKey);
          updatedFilters[index].values = [
            ...new Set(updatedFilters[index].values),
          ];
        } else {
          // Remove value from existing filter key
          updatedFilters[index].values = updatedFilters[index].values.filter(
            (val) => val !== valueForKey
          );

          // Remove filter if no value is selected
          if (updatedFilters[index].values.length === 0) {
            updatedFilters.splice(index, 1);
          }
        }
      }

      return updatedFilters;
    });
  };

  return (
    <>
      {attrsFilter &&
        attrsFilter.length > 0 &&
        attrsFilter.map((filter, idx) => (
          <div key={idx} className="mb-3">
            <Form.Label>
              <b>{filter.key}</b>
            </Form.Label>
            {filter.value.map((valueForKey, idx2) => (
              <Form.Check
                key={idx2}
                type="checkbox"
                label={valueForKey}
                onChange={(e) =>
                  handleCheckboxChange(filter, valueForKey, e.target.checked)
                }
              />
            ))}
          </div>
        ))}
    </>
  );
};

export default AttributesFilterComponent;
