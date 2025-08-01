import React, { useState } from 'react';
import { Container, Grid, Pagination, CircularProgress } from '@mui/material';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';
import { BasicButton } from '../utils/buttonStyles';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';
import { addStuff } from '../redux/userHandle';

const Products = ({ productData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemsPerPage = 9;

  const { currentRole, responseSearch, loading, error } = useSelector(state => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productData?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const handleAddToCart = (event, product) => {
    event.stopPropagation();
    dispatch(addToCart(product));
  };

  const handleUpload = (event, product) => {
    event.stopPropagation();
    try {
        console.log('Uploading product:', product);
        dispatch(addStuff("ProductCreate", product));
    } catch (error) {
        console.error('Error uploading product:', error);
        setMessage("Error uploading product. Please try again.");
        setShowPopup(true);
    }
  };

  const messageHandler = (event) => {
    event.stopPropagation();
    setMessage("You have to login or register first")
    setShowPopup(true)
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorMessage>Error loading products: {error.message}</ErrorMessage>;
  }

  if (responseSearch) {
    return <ErrorMessage>Product not found</ErrorMessage>;
  }

  if (!currentItems || currentItems.length === 0) {
    return <ErrorMessage>No products available</ErrorMessage>;
  }

  return (
    <>
      <ProductGrid container spacing={3}>
        {currentItems.map((data, index) => (
          <Grid item xs={12} sm={6} md={4}
            key={index}
            onClick={() => navigate("/product/view/" + data._id)}
            sx={{ cursor: "pointer" }}
          >
            <ProductContainer>
              <ProductImage src={data.productImage} alt={data.productName} />
              <ProductName>{data.productName}</ProductName>
              <PriceMrp>₹{data.price.mrp}</PriceMrp>
              <PriceCost>₹{data.price.cost}</PriceCost>
              <PriceDiscount>{data.price.discountPercent}% off</PriceDiscount>
              <AddToCart>
                {currentRole === "Customer" &&
                  <>
                    <BasicButton
                      onClick={(event) => handleAddToCart(event, data)}
                    >
                      Add To Cart
                    </BasicButton>
                  </>
                }
                {currentRole === "Shopcart" &&
                  <>
                    <BasicButton
                      onClick={(event) => handleUpload(event, data)}
                    >
                      Upload
                    </BasicButton>
                  </>
                }
                {currentRole === null &&
                  <>
                    <BasicButton
                      onClick={messageHandler}
                    >
                      Add To Cart
                    </BasicButton>
                  </>
                }
              </AddToCart>
            </ProductContainer>
          </Grid>
        ))}
      </ProductGrid>

      <Container sx={{ mt: 10, mb: 10, display: "flex", justifyContent: 'center', alignItems: "center" }}>
        <Pagination
          count={Math.ceil((productData?.length || 0) / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="secondary"
        />
      </Container>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default Products;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #d32f2f;
  padding: 20px;
  font-size: 1.2rem;
`;

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
`;

const ProductGrid = styled(Grid)`
  display: flex;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 200px;
  height: auto;
  margin-bottom: 8px;
`;

const ProductName = styled.p`
  font-weight: bold;
  text-align: center;
`;

const PriceMrp = styled.p`
  margin-top: 8px;
  text-align: center;
  text-decoration: line-through;
  color: #525050;
`;

const PriceCost = styled.h3`
  margin-top: 8px;
  text-align: center;
`;

const PriceDiscount = styled.p`
  margin-top: 8px;
  text-align: center;
  color: darkgreen;
`;

const AddToCart = styled.div`
  margin-top: 16px;
`;