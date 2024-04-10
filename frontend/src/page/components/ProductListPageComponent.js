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
  const [showResetFiltersButton, setShowResetFiltersButton] = useState(false);
  const [filters, setFilters] = useState({
    price: 25000000,
    rating: {},
    category: {},
    attrs: [],
  });
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
    const selectedCategories = Object.keys(filters.category).filter(
      (key) => filters.category[key]
    );

    const selectedAttrs = filters.attrs;

    getProducts(
      categoryName,
      pageNumParam,
      searchQuery,
      filters,
      selectedCategories,
      selectedAttrs
    )
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
  }, [categoryName, pageNumParam, searchQuery, filters]);

  const handleFilters = () => {
    navigate(location.pathname.replace(/\/[0-9]+$/, ""));
    setShowResetFiltersButton(true);
  };

  const resetFilters = () => {
    setShowResetFiltersButton(false);
    setFilters({
      price: 25000000,
      rating: {},
      category: {},
      attrs: [],
    });
    window.location.href = "/product-list";
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item className="mb-3 mt-3">
              <SortOptionsComponent />
            </ListGroup.Item>
            <ListGroup.Item>
              FILTER: <br />
              <PriceFilterComponent
                price={filters.price}
                setPrice={(price) => setFilters({ ...filters, price })}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <RatingFilterComponent
                setRatingsFromFilter={(ratings) =>
                  setFilters({ ...filters, rating: ratings })
                }
              />
            </ListGroup.Item>
            {!location.pathname.match(/\/category/) && (
              <ListGroup.Item>
                <CategoryFilterComponent
                  setCategoriesFromFilter={(categories) =>
                    setFilters({ ...filters, category: categories })
                  }
                />
              </ListGroup.Item>
            )}
            <ListGroup.Item>
              <AttributesFilterComponent
                attrsFilter={attrsFilter}
                setAttrsFromFilter={(attrs) =>
                  setFilters({ ...filters, attrs: attrs })
                }
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
