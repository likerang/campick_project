import Image from "next/image";
import Link from 'next/link';

import "../css/store.css";

export const metadata = {
  title: "Campick - 스토어",
  description: "Welcome to Campick",
};

export default function Store() {
  return (
    <>
      <div className="store_category">
        <h3 className="medium_tb">캠핑</h3>
        <nav className="category_menu">
          <ul className="small_tr">
            <li><Link href="#" className="category selected">텐트/타프</Link></li>
            <li><Link href="#" className="category">침구/매트</Link></li>
            <li><Link href="#" className="category">체어/테이블</Link></li>
            <li><Link href="#" className="category">가구/가방/수납</Link></li>
            <li><Link href="#" className="category">랜턴/조명</Link></li>
            <li><Link href="#" className="category">키친</Link></li>
            <li><Link href="#" className="category">버너/토치/화로</Link></li>
            <li><Link href="#" className="category">쿨러/워터저그</Link></li>
            <li><Link href="#" className="category">웨건/카드</Link></li>
            <li><Link href="#" className="category">계절용품/기타</Link></li>
          </ul>
        </nav>
      </div>

      <div className="brand_filter">
        <h3 className="medium_tb">텐트/타프</h3>
        <div>
          <button>
            브랜드
            <Image src="/images/banner_small_arrow.svg" alt="화살표" width={10} height={10} />
          </button>
          <div className="brand_selected"></div>
        </div>
      </div>

      <ul className="product_list_wrapper">
      </ul>

      <div className="overlay"></div>
      <div className="brand_popup">
        <div className="search_input">
          <h4 className="normal_tb">브랜드 검색</h4>
          <div className="brand_search">
            <input type="text" placeholder="어떤 상품을 찾으시나요?" />
            <button type="button"></button>
          </div>
        </div>
        <ul className="brand_list">
          {[
            { title: "힐레베르그 Hilleberg", value: "힐레베르그" },
            { title: "몽벨 Montbell", value: "몽벨" },
            { title: "헬리녹스 Helinox", value: "헬리녹스" },
            { title: "노르디스트 Nordisk", value: "노르디스트" },
            { title: "엠에스알 Msr", value: "엠에스알" },
            { title: "니모 Nemo", value: "니모" },
          ].map((brand) => (
            <li key={brand.value}>
              <label className="brand_item">
                <span className="brand_title">{brand.title}</span>
                <input type="checkbox" name="brand" value={brand.value} />
                <span className="custom_checkbox"></span>
              </label>
            </li>
          ))}
          <li className="no_result">
            <Image src="/images/store_logo_small.svg" alt="검색 결과 없음" width={35} height={54} />
            <p className="small_tb">검색 결과가 없습니다.</p>
            <p className="small_tb">새로 검색해 보세요</p>
          </li>
        </ul>
        <button className="apply_btn">적용하기</button>
      </div>
    </>
    )
};