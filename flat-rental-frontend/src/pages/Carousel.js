import React from 'react';
import { Carousel, ButtonGroup, Button } from 'react-bootstrap';

import slide1 from './images/carousel1.jpg';
import slide2 from './images/carousel2.jpg';
import slide3 from './images/carousel3.jpg';
import { Link } from 'react-router-dom';

const CarouselSlide = () => {
  return (
    <>
    <div className='mt-5'>
      <Carousel>
        <Carousel.Item>
          <div className="custom-carousel-image-container">
            <img
              className="custom-carousel-image"
              src={slide1}
              alt="First slide"
            />
          </div>
          <Carousel.Caption>
            <ButtonGroup size="lg" className="mb-2">
              <Link to="/login"><Button variant="info gradient me-2">Login</Button></Link>
              <Link to="/cregister"><Button variant="success gradient">Signup</Button></Link>
            </ButtonGroup>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="custom-carousel-image"
            src={slide2}
            alt="Second slide"
          />
          <Carousel.Caption>{/* Your caption for the second slide */}</Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="custom-carousel-image"
            src={slide3}
            alt="Third slide"
          />
          <Carousel.Caption>{/* Your caption for the third slide */}</Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      </div>
      </>
  );
};

export default CarouselSlide;
