import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Custom styles within this component or could be in index.css
const ArticleCarousel = ({ title, articles }) => {
    if (!articles || articles.length === 0) return null;

    return (
        <section className="article-carousel-section" style={{ padding: '20px 0', background: '#000' }}>
            <div className="container">
                <h2 style={{
                    marginBottom: '30px',
                    fontSize: '2rem',
                    textAlign: 'center',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: '#fff'
                }}>
                    {title || 'DESCANSA MÁS'}
                </h2>

                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1.2}
                    centeredSlides={true}
                    loop={true}
                    navigation
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2.2 },
                        768: { slidesPerView: 3.2 },
                        1024: { slidesPerView: 4.2 },
                    }}
                    className="mySwiper"
                    style={{ paddingBottom: '40px' }}
                >
                    {articles.map((article) => (
                        <SwiperSlide key={article.id}>
                            <Link to={`/article/${article.id}`} className="carousel-card">
                                <div className="carousel-image-wrapper" style={{
                                    aspectRatio: '2/3',
                                    overflow: 'hidden',
                                    borderRadius: '4px',
                                    position: 'relative',
                                    marginBottom: '10px'
                                }}>
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease'
                                        }}
                                    />
                                    <div className="carousel-overlay" style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6) 50%, transparent)',
                                        padding: '20px 15px',
                                        paddingTop: '60px'
                                    }}>
                                        <h3 className="text-contrast-safe" style={{
                                            color: '#fff',
                                            fontSize: '1rem',
                                            fontWeight: '700',
                                            lineHeight: '1.2',
                                            fontFamily: 'var(--font-serif)',
                                            display: 'block',
                                            overflow: 'visible',
                                            height: 'auto',
                                            textAlign: 'center'
                                        }}>
                                            {article.title}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default ArticleCarousel;
