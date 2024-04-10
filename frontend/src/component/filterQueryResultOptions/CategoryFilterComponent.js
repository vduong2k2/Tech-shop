import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";

const CategoryFilterComponent = ({ setCategoriesFromFilter }) => {
  const { categories } = useSelector((state) => state.getCategories);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const myRefs = useRef([]);

  const selectCategory = (e, category) => {
    setCategoriesFromFilter((items) => ({
      ...items,
      [category.name]: e.target.checked,
    }));

    const selectedMainCategory = category.name.split("/")[0];
    const indexesOfMainCategory = categories
      .filter((item) => selectedMainCategory === item.name.split("/")[0])
      .map((item, idx) => idx);

    const updatedCategories = e.target.checked
      ? [...selectedCategories, selectedMainCategory]
      : selectedCategories.slice(0, -1);

    setSelectedCategories(updatedCategories);

    myRefs.current.forEach((ref, idx) => {
      ref.disabled = !updatedCategories.some((cat) =>
        indexesOfMainCategory.includes(idx)
      );
    });

    if (updatedCategories.length === 0) {
      window.location.href = "/product-list";
    }
  };

  return (
    <>
      <span className="fw-bold">Danh mục</span>
      <Form>
        {categories.map((category, idx) => (
          <div key={idx}>
            <Form.Check type="checkbox" id={`check-api2-${idx}`}>
              <Form.Check.Input
                ref={(el) => (myRefs.current[idx] = el)}
                type="checkbox"
                isValid
                onChange={(e) => selectCategory(e, category)}
              />
              <Form.Check.Label style={{ cursor: "pointer" }}>
                {category.name}
              </Form.Check.Label>
            </Form.Check>
          </div>
        ))}
      </Form>
    </>
  );
};

export default CategoryFilterComponent;
