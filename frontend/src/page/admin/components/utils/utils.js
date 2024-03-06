export const changeCategory = (
  e,
  categories,
  setAttributesFromDb,
  setCategoryChoosen
) => {
  const selectedCategory = e.target.value;

  // Tìm danh mục được chọn trong mảng categories
  const selectedCategoryObject = categories.find(
    (cat) => cat.name === selectedCategory
  );

  if (selectedCategoryObject) {
    // Kiểm tra xem có phải là danh mục "laptop" không
    if (selectedCategoryObject.name === "Laptop") {
      // Lấy thuộc tính trực tiếp từ danh mục "laptop"
      const laptopAttributes = selectedCategoryObject.attrs || [];
      setAttributesFromDb(laptopAttributes);
    } else {
      // Nếu không phải là danh mục "laptop", có thể xử lý theo cách khác nếu cần thiết
      setAttributesFromDb([]);
    }

    // Cập nhật trạng thái danh mục được chọn
    setCategoryChoosen(selectedCategory);
  }
};

export const setValuesForAttrFromDbSelectForm = (
  e,
  attrVal,
  attributesFromDb
) => {
  const selectedValue = e.target.value;

  if (selectedValue === "Choose attribute") {
    return;
  }

  const selectedAttr = attributesFromDb.find(
    (item) => item.key === selectedValue
  );

  if (selectedAttr && selectedAttr.value && selectedAttr.value.length > 0) {
    const valuesForAttrKeys = attrVal.current;

    // Clear existing options
    valuesForAttrKeys.innerHTML = "";

    // Add a default option
    valuesForAttrKeys.options.add(new Option("Choose attribute value"));

    // Add new options for each value in selectedAttr.value
    selectedAttr.value.forEach((item) => {
      valuesForAttrKeys.add(new Option(item));
    });
  }
};

export const setAttributesTableWrapper = (key, val, setAttributesTable) => {
  setAttributesTable((attr) => {
    if (attr.length !== 0) {
      var keyExistsInOldTable = false;
      let modifiedTable = attr.map((item) => {
        if (item.key === key) {
          keyExistsInOldTable = true;
          item.value = val;
          return item;
        } else {
          return item;
        }
      });
      if (keyExistsInOldTable) return [...modifiedTable];
      else return [...modifiedTable, { key: key, value: val }];
    } else {
      return [{ key: key, value: val }];
    }
  });
};
