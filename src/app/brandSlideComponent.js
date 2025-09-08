'use client';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import Image from 'next/image';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// import required modules
import { FreeMode } from 'swiper/modules';

export default function App() {
  const brandSlide = [{
    src: '/images/main_brand1.png',
    width: 71,
    height: 47
  },
  {
    src: '/images/main_brand2.png',
    width: 83,
    height: 18
  },
  {
    src: '/images/main_brand3.png',
    width: 79,
    height: 21
  },
  {
    src: '/images/main_brand4.png',
    width: 79,
    height: 21
  },
  {
    src: '/images/main_brand5.png',
    width: 74,
    height: 21
  }, {
    src: '/images/main_brand1.png',
    width: 71,
    height: 47
  },
  {
    src: '/images/main_brand2.png',
    width: 83,
    height: 18
  },
  {
    src: '/images/main_brand3.png',
    width: 79,
    height: 21
  },
  {
    src: '/images/main_brand4.png',
    width: 79,
    height: 21
  },
  {
    src: '/images/main_brand5.png',
    width: 74,
    height: 21
  }]
  return (
    <>
      <Swiper
        slidesPerView={5}
        spaceBetween={15}
        freeMode={true}
        modules={[FreeMode]}
        className="mySwiper"
      >
        {brandSlide.map((item, idx) => {
          return (
            <SwiperSlide key={idx}>
              <Link href="/store">
                <Image
                  src={item.src}
                  width={item.width}
                  height={item.height}
                  alt=""
                />
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  );
}
