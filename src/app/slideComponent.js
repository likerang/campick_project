'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import Image from "next/image";
import Link from "next/link"

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';
import { Navigation } from 'swiper/modules';
export default function ProdDetailClient({ images }) {
  const bannerSlide = ['/images/main_banner1.jpg', '/images/main_banner2.jpg']

  return (
    <Swiper
      pagination={{ clickable: true }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="mySwiper">
      {bannerSlide.map((item, idx) => {
        return (
          <SwiperSlide key={idx}>
            <Link href="">
              <Image
                src={item}
                width={780}
                height={240}
                alt="배너 이미지"
              />
            </Link>
            {/* <h3 className="slide_title">필수 겨울템</h3>
            <p className="slide_desc">눈 내려도 따뜻하게 미리 준비하는 동계캠핑</p> */}
          </SwiperSlide>
        )
      })}
    </Swiper>
  );
}