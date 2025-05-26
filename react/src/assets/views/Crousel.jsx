
import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosClient from "../../axios-client.jsx";

const CarouselComponent = () => {
    const [slides, setSlides] = useState([]);
    useEffect(() => {
        axiosClient.get("/sliders")
            .then((response) => {
            // console.log(response.data)
                setSlides(response.data);
            })
            .catch((error) => {
                console.error("Error fetching slider data:", error);
            });
    }, []);
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2%' }}>
    <Carousel>
        {slides.map((slide) => (
            <Carousel.Item key={slide.id}>
                <img
                    className="d-block w-100"
                    src={`http://127.0.0.1:8000/storage/${slide.image_path}`}
                    alt={slide.image_path}
                    style={{
                        objectFit: 'cover', // Ensures images cover the space without distortion
                        height: '400px', // Fixed height for the images
                    }}
                />
                <Carousel.Caption
                    style={{
                        background: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for text
                        color: '#fff', // White text
                        padding: '1rem',
                        borderRadius: '10px', // Rounded corners for the caption
                    }}
                >
                    <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{slide.title}</h3>
                    <p style={{ fontSize: '1.1rem' }}>{slide.description}</p>
                </Carousel.Caption>
            </Carousel.Item>
        ))}
    </Carousel>
</div>

  );
};

export default CarouselComponent;
