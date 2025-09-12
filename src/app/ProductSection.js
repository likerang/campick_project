"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function ProductSection({ products }) {
  // 상태 관리
  const [visibleCount, setVisibleCount] = useState(6);

  // 더보기 함수
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  return (
    <div className={styles.new_product_content}>
      <h3 className={`medium_tb ${styles.new_product_title}`}>오늘 등록된 상품</h3>
      <ul className={`product_list_wrapper ${styles.product_list_wrapper}`}>
        {products.slice(0, visibleCount).map(item =>
          <li className="product_card" key={item.prod_id}>
            <Link href={`/prod_detail/${item.prod_id}`}>
              <div className="product_image">
                <Image
                  src={item.prod_images.split(",")[0]}
                  width={250}
                  height={250}
                  alt="캠핑상품"
                />
              </div>
              <div className="product_info">
                <h3 className="product_title">{item.prod_title}</h3>
                <div className="product_meta">
                  <span className="product_location">종로1가동</span>
                  <span className="product_date">4시간 전</span>
                </div>
                <div className="product_footer">
                  <span className="product_price normal_tb">{item.prod_price.toLocaleString()} 원</span>
                  <ul className="product_stats">
                    <li className="view">
                      <p className="icon">
                        <Image src="/images/prod_detail_view.svg" width={14} height={14} alt="조회수" />
                      </p>
                      <span>{item.views}</span>
                    </li>
                    <li className="message">
                      <p className="icon">
                        <Image src="/images/prod_detail_chat.svg" width={12} height={12} alt="메세지" />
                      </p>
                      <span>{item.messages}</span>
                    </li>
                    <li className="like">
                      <p className="icon">
                        <Image src="/images/prod_detail_bookmark.svg" width={14} height={14} alt="즐겨찾기" />
                      </p>
                      <span>{item.likes}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Link>
          </li>
        )}
      </ul>

      {/* 더보기 버튼 */}
      {visibleCount < products.length && (
        <button className="more_btn" onClick={handleLoadMore}>
          더 보기
        </button>
      )}
    </div>
  );
}