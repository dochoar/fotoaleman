import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { articles } from '../data/articles';

// Placeholder data for the remaining 4 articles
const PLACEHOLDERS = [
    {
        id: 'pj-1',
        title: 'Hacienda San Gabriel de las Palmas',
        subtitle: 'Un viaje al pasado colonial con lujo moderno.',
        image: 'https://loremflickr.com/600/900/hacienda,luxury?lock=301',
        link: '#'
    },
    {
        id: 'pj-2',
        title: 'Anticavilla Hotel',
        subtitle: 'Donde el arte y la hospitalidad se encuentran.',
        image: 'https://loremflickr.com/600/900/hotel,art?lock=302',
        link: '#'
    },
    {
        id: 'pj-3',
        title: 'Las Mañanitas',
        subtitle: 'Tradición gastronómica y jardines de ensueño.',
        image: 'https://loremflickr.com/600/900/garden,restaurant?lock=303',
        link: '#'
    },
    {
        id: 'pj-4',
        title: 'Hostal de la Luz',
        subtitle: 'El santuario holístico de Tepoztlán.',
        image: 'https://loremflickr.com/600/900/meditation,mountain?lock=304',
        link: '#'
    }
];

const TesorosCarousel = ({ title, subtitle, articles: propArticles }) => {
    // Determine the articles to show: props or fallback logic
    let carouselItems = [];

    if (propArticles && propArticles.length > 0) {
        carouselItems = propArticles;
    } else {
        // Fallback to original logic if no props provided (Backwards compatibility)
        const realHighLights = [6, 7, 8].map(id => articles.find(a => a.id === id)).filter(Boolean);
        const remainingPlaceholders = PLACEHOLDERS.slice(1);
        carouselItems = [...realHighLights, ...remainingPlaceholders];
    }

    // Default text content
    const displayTitle = title || "TESOROS DE MORELOS";
    const displaySubtitle = subtitle || "Los mejores hoteles se distinguen con la denominación Tesoros de Morelos; descúbrelos aquí.";

    return (
        <section className="tesoros-section" style={{ padding: '20px 0', backgroundColor: '#fff' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        marginBottom: '10px',
                        color: '#1a1a1a'
                    }}>
                        {displayTitle}
                    </h2>
                    <p style={{
                        fontSize: '1rem',
                        color: '#666',
                        maxWidth: '700px',
                        margin: '0 auto',
                        fontFamily: "'Outfit', sans-serif"
                    }}>
                        {displaySubtitle}
                    </p>
                </div>

                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1.2}
                    navigation
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2.2 },
                        968: { slidesPerView: 3 }, // Show 3 full cards nicely
                    }}
                    className="tesorosSwiper"
                    style={{ paddingBottom: '20px' }}
                >
                    {carouselItems.map((item, index) => {
                        // Determine link and image based on whether it's a real article or placeholder
                        const isReal = typeof item.id === 'number';
                        const linkUrl = isReal ? `/article/${item.id}` : '#';
                        const imgSrc = item.image;
                        const title = item.title;

                        return (
                            <SwiperSlide key={item.id || index}>
                                <Link to={linkUrl} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                    <div className="tesoro-card" style={{ transition: 'transform 0.3s ease', textAlign: 'center' }}>
                                        <div className="image-wrapper" style={{
                                            aspectRatio: '4/3', // Slightly wider than portrait to match screenshot
                                            overflow: 'hidden',
                                            borderRadius: '8px',
                                            marginBottom: '15px'
                                        }}>
                                            <img
                                                src={imgSrc}
                                                alt={title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.5s ease'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                        </div>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '700',
                                            lineHeight: '1.3',
                                            marginBottom: '10px',
                                            minHeight: '2.6em', // ensure alignment
                                            fontFamily: "'Outfit', sans-serif"
                                        }}>
                                            {title}
                                        </h3>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
};

export default TesorosCarousel;
