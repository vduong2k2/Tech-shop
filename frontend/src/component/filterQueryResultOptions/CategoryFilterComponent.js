import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";

const CategoryFilterComponent = ({ setCategoriesFromFilter }) => {
  const { categories } = useSelector((state) => state.getCategories);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const myRefs = useRef([]);

  const selectCategory = (e, category, idx) => {
    setCategoriesFromFilter((items) => {
      return { ...items, [category.name]: e.target.checked };
    });

    const selectedMainCategory = category.name.split("/")[0];
    const allCategories = myRefs.current.map((_, id) => ({
      name: categories[id].name,
      idx: id,
    }));
    const indexesOfMainCategory = allCategories
      .filter((item) => selectedMainCategory === item.name.split("/")[0])
      .map((item) => item.idx);

    if (e.target.checked) {
      setSelectedCategories((old) => {
        const updatedCategories = [...old, selectedMainCategory];
        myRefs.current.forEach((_, idx) => {
          if (!indexesOfMainCategory.includes(idx))
            myRefs.current[idx].disabled = false; // Thay đổi từ true sang false để enable
        });
        return updatedCategories;
      });
    } else {
      setSelectedCategories((old) => {
        const updatedCategories = [...old];
        updatedCategories.pop();
        if (updatedCategories.length === 0)
          window.location.href = "/product-list";
        myRefs.current.forEach((_, idx2) => {
          if (allCategories.length === 1 || updatedCategories.length === 1)
            myRefs.current[idx2].disabled = false;
        });
        return updatedCategories;
      });
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
                onChange={(e) => selectCategory(e, category, idx)}
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
