import React, { useEffect, useState } from "react";
import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PaginationComponent from "../../component/PaginationComponent";
import ProductForListComponent from "../../component/ProductForListComponent";
import SortOptionsComponent from "../../component/SortOptionsComponent";
import PriceFilterComponent from "../../component/filterQueryResultOptions/PriceFilterComponent";
import RatingFilterComponent from "../../component/filterQueryResultOptions/RatingFilterComponent";
import CategoryFilterComponent from "../../component/filterQueryResultOptions/CategoryFilterComponent";
import AttributesFilterComponent from "../../component/filterQueryResultOptions/AttributesFilterComponent";

const ProductListPageComponent = ({ getProducts, categories }) => {
  const { categoryName, pageNumParam, searchQuery } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attrsFilter, setAttrsFilter] = useState([]);
  const [attrsFromFilter, setAttrsFromFilter] = useState([]);
  const [showResetFiltersButton, setShowResetFiltersButton] = useState(false);
  const [filters, setFilters] = useState({});
  const [price, setPrice] = useState(25000000);
  const [ratingsFromFilter, setRatingsFromFilter] = useState({});
  const [categoriesFromFilter, setCategoriesFromFilter] = useState({});
  const [sortOption, setSortOption] = useState("");
  const [paginationLinksNumber, setPaginationLinksNumber] = useState(null);
  const [pageNum, setPageNum] = useState(null);

  useEffect(() => {
    if (categoryName) {
      const categoryAllData = categories.find(
        (item) => item.name === categoryName.replaceAll(",", "/")
      );
      if (categoryAllData) {
        const mainCategory = categoryAllData.name.split("/")[0];
        const index = categories.findIndex(
          (item) => item.name === mainCategory
        );
        setAttrsFilter(categories[index]?.attrs || []);
      }
    } else {
      setAttrsFilter([]);
    }
  }, [categoryName, categories]);

  useEffect(() => {
    if (Object.entries(categoriesFromFilter).length > 0) {
      setAttrsFilter([]);
      const cat = [];
      Object.entries(categoriesFromFilter).forEach(([category, checked]) => {
        if (checked) {
          const name = category.split("/")[0];
          cat.push(name);
          const count = cat.filter((x) => x === name).length;
          if (count === 1) {
            const index = categories.findIndex((item) => item.name === name);
            setAttrsFilter((attrs) => [
              ...attrs,
              ...(categories[index]?.attrs || []),
            ]);
          }
        }
      });
    }
  }, [categoriesFromFilter, categories]);

  useEffect(() => {
    getProducts(categoryName, pageNumParam, searchQuery, filters, sortOption)
      .then((products) => {
        setProducts(products.products);
        setPaginationLinksNumber(products.paginationLinksNumber);
        setPageNum(products.pageNum);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      });
  }, [categoryName, pageNumParam, searchQuery, filters, sortOption]);

  const handleFilters = () => {
    navigate(location.pathname.replace(/\/[0-9]+$/, ""));
    setShowResetFiltersButton(true);
    setFilters({
      price,
      rating: ratingsFromFilter,
      category: categoriesFromFilter,
      attrs: attrsFromFilter,
    });
  };

  const resetFilters = () => {
    setShowResetFiltersButton(false);
    setFilters({});
    window.location.href = "/product-list";
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item className="mb-3 mt-3">
              <SortOptionsComponent setSortOption={setSortOption} />
            </ListGroup.Item>
            <ListGroup.Item>
              FILTER: <br />
              <PriceFilterComponent price={price} setPrice={setPrice} />
            </ListGroup.Item>
            <ListGroup.Item>
              <RatingFilterComponent
                setRatingsFromFilter={setRatingsFromFilter}
              />
            </ListGroup.Item>
            {!location.pathname.match(/\/category/) && (
              <ListGroup.Item>
                <CategoryFilterComponent
                  setCategoriesFromFilter={setCategoriesFromFilter}
                />
              </ListGroup.Item>
            )}
            <ListGroup.Item>
              <AttributesFilterComponent
                attrsFilter={attrsFilter}
                setAttrsFromFilter={setAttrsFromFilter}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <Button variant="primary" onClick={handleFilters}>
                Lọc
              </Button>{" "}
              {showResetFiltersButton && (
                <Button onClick={resetFilters} variant="danger">
                  Đặt lại bộ lọc
                </Button>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={9}>
          {loading ? (
            <h1>Sản phẩm ....</h1>
          ) : error ? (
            <h1>Lỗi khi tải sản phẩm. Thử lại sau.</h1>
          ) : (
            products.map((product) => (
              <ProductForListComponent
                key={product._id}
                images={product.images}
                name={product.name}
                description={product.description}
                price={product.price}
                rating={product.rating}
                reviewsNumber={product.reviewsNumber}
                productId={product._id}
              />
            ))
          )}
          {paginationLinksNumber > 1 && (
            <PaginationComponent
              categoryName={categoryName}
              searchQuery={searchQuery}
              paginationLinksNumber={paginationLinksNumber}
              pageNum={pageNum}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPageComponent;
