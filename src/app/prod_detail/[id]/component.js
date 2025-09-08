'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import Image from "next/image";
// Swiper CSS import
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Scrollbar } from 'swiper/modules';

export default function ProdDetailClient({ images }) {
  -
    console.log('컴포넌트 : ' + images);
  const imageArr = images.split(',');
  console.log(imageArr)
  return (
    <div>
      <Swiper
        scrollbar={{
          hide: false,
        }}
        modules={[Scrollbar]}
        className="mySwiper"
      >
        {imageArr.map((image, idx) => {
          return (
            <SwiperSlide key={idx}>
              <Image
                src={image}
                width={750}
                height={690}
                alt=""
              />
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  );
}