import Image from "next/image";
import Link from 'next/link';

import "../css/sale_list.css";

export const metadata = {
  title: "Campick - 판매목록",
  description: "Welcome to Campick",
};

export default function Salelist() {
  return (
    <div className="salelist_page">
      <div className="user_profile_wrapper">
        <div className="profile_card">
          <div className="profile_img_wrapper">
            <img src="/images/user_profile_img.jpg" alt="사용자 프로필" />
          </div>
          <div className="user_info">
            <h2 id="user_id">User_ID</h2>
            <ul className="stats_wrapper">
              <li className="stat_item">
                <h4 className="stat_title">게시글</h4>
                <p className="stat_number">23</p>
              </li>
              <li className="stat_item">
                <h4 className="stat_title">팔로워</h4>
                <p className="stat_number">500</p>
              </li>
              <li className="stat_item">
                <h4 className="stat_title">팔로잉</h4>
                <p className="stat_number">234</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="point_card">
          <h3 className="point_title">캠픽페이</h3>
          <p className="point_value">5,000,000 원</p>
          <div className="button_group">
            <button className="point_btn">충전</button>
            <button className="point_btn">이체</button>
          </div>
        </div>
      </div>
      <div className="tab_menu">
        <Link href="#" className="active" data-filter="selling">판매중</Link>
        <Link href="#" data-filter="soldout">결제완료</Link>
      </div>
      <ul className="product_list_wrapper_2col" data-list="selling">
        {[1, 2, 3].map((item) => (
          <li key={item} className="product_card_2col">
            <Link href="#">
              <div className="product_image">
                <Image src={`/images/product_img0${item}.jpg`} width={357} height={357} alt={`상품 ${item}`} />
              </div>
              <div className="product_info">
                <h3 className="product_title small_tr">[힐레베르그] 알락 {item} 텐트 (Allak {item})</h3>
                <div className="product_meta">
                  <span className="product_location">종로1가동</span>
                  <span className="product_date">4시간 전</span>
                </div>
                <div className="product_footer">
                  <span className="product_price normal_tb">1,893,000 원</span>
                  <ul className="product_stats">
                    <li className="view">
                      <p className="icon">
                        <Image src="/images/prod_detail_view.svg" width={14} height={14} alt="조회수" />
                      </p>
                      <span>12</span>
                    </li>
                    <li className="message">
                      <p className="icon">
                      <Image src="/images/prod_detail_chat.svg" width={12} height={12} alt="메세지" />
                      </p>
                      <span>1</span>
                    </li>
                    <li className="like">
                      <p className="icon">
                        <Image src="/images/prod_detail_bookmark.svg" width={14} height={14} alt="즐겨찾기" />
                      </p>
                      <span>12</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Link>
            <button className="more_btn">⋯</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
