import { Form } from "react-bootstrap";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
const PriceFilterComponent = ({ price, setPrice }) => {
  return (
    <>
      <Form.Label>
        <span className="fw-bold">Giá không lớn hơn:</span>{" "}
        {formatter.format(price)}
      </Form.Label>
      <Form.Range
        min={0}
        max={50000000}
        step={10}
        onChange={(e) => setPrice(e.target.value)}
      />
    </>
  );
};

export default PriceFilterComponent;
