import { Form } from "react-bootstrap";

const SortOptionsComponent = ({ setSortOption }) => {
  return (
    <Form.Select
      onChange={(e) => setSortOption(e.target.value)}
      aria-label="Default select example"
    >
      <option>SORT BY</option>
      <option value="price_1">Giá: Thấp đến cao</option>
      <option value="price_-1">Giá: Cao đến thấp</option>
      <option value="rating_-1">Theo đánh giá</option>
      <option value="name_1">Từ A-Z</option>
      <option value="name_-1">Từ Z-A</option>
    </Form.Select>
  );
};

export default SortOptionsComponent;
