'use client';

import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from "react";

import "../css/sale_list.css";

// export const metadata = {
//   title: "Campick - 판매목록",
//   description: "Welcome to Campick",
// };

export default function Salelist() {
  const [activeTab, setActiveTab] = useState('selling');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [products, setProducts] = useState([
    {
      id: 1,
      title: '[힐레베르그] 알락 1 텐트 (Allak 1)',
      price: '1,893,000 원',
      location: '종로1가동',
      date: '4시간 전',
      image: '/images/product_img01.jpg',
      views: 12,
      messages: 1,
      likes: 12,
      isSoldout: false  // 판매완료 여부
    },
    {
      id: 2,
      title: '[힐레베르그] 알락 2 텐트 (Allak 2)',
      price: '2,100,000 원',
      location: '강남구',
      date: '6시간 전',
      image: '/images/product_img02.jpg',
      views: 25,
      messages: 3,
      likes: 18,
      isSoldout: false
    },
    {
      id: 3,
      title: '[힐레베르그] 나마츠 2 텐트 (Nammatj 2)',
      price: '1,240,0000 원',
      location: '서초구',
      date: '1일 전',
      image: '/images/product_img03.jpg',
      views: 8,
      messages: 0,
      likes: 5,
      isSoldout: false
    }
  ]);

  /* 저장된 판매완료 상품들 불러오기 */
  useEffect(() => {
    const saved = localStorage.getItem('soldoutProducts');
    if (saved) {
      const soldoutIds = JSON.parse(saved);
      setProducts(products.map(product => ({
        ...product,
        isSoldout: soldoutIds.includes(product.id)
      })));
    }
  }, []);



  /* 탭 클릭 */
  function handleTabClick(tabName) {
    setActiveTab(tabName);
  }

  /* 더보기 클릭 */
  function handleMoreClick(product) {
    setSelectedProduct(product);
    setShowPopup(true);
  }

  /* 팝업 닫기 */
  function closePopup() {
    setShowPopup(false);
    setSelectedProduct(null);
  }

  /* 판매완료 클릭 */
  function handleSoldout() {
    if (selectedProduct) {
      const updatedProducts = products.map(product => {
        if (product.id === selectedProduct.id) {
          return { ...product, isSoldout: true };
        }
        return product;
      });
      setProducts(updatedProducts);

      /* 판매완료된 상품 ID들을 localStorage에 저장 */
      const soldoutIds = updatedProducts
        .filter(p => p.isSoldout)
        .map(p => p.id);
      localStorage.setItem('soldoutProducts', JSON.stringify(soldoutIds));
      
      setActiveTab('soldout');

      closePopup();
    }
  }

  /* 삭제 클릭 */
  function handleDelete() {
    if (selectedProduct && confirm('정말 삭제하시겠습니까?')) {
      const updatedProducts = products.filter(p => p.id !== selectedProduct.id);
      setProducts(updatedProducts);

      const soldoutIds = updatedProducts
        .filter(p => p.isSoldout)
        .map(p => p.id);
      localStorage.setItem('soldoutProducts', JSON.stringify(soldoutIds));

      closePopup();
    }
  }

  const displayProducts = products.filter(product => {
    if (activeTab === 'selling') {
      return !product.isSoldout;
    } else {
      return product.isSoldout; 
    }
  });



  return (
    <div className="salelist_page">
      <div className="user_profile_wrapper">
        <div className="profile_card">
          <div className="profile_img_wrapper">
            <Image src="/images/user_profile_img.jpg" width={72} height={72} alt="사용자 프로필" />
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
        <Link 
          href="#" 
          className={activeTab === 'selling' ? 'active' : ''} 
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('selling');
          }}>
          판매중
        </Link>
        <Link 
          href="#" 
          className={activeTab === 'soldout' ? 'active' : ''} 
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('soldout');
          }}>
        결제완료
        </Link>
      </div>
      <ul className="product_list_wrapper_2col">
        {displayProducts.map((product) => (
          <li key={product.id} className={`product_card_2col ${product.isSoldout ? 'disable' : ''}`}>
            <Link href="#">
              {product.isSoldout && 
              <div className="soldout_badge">판매 완료</div>}
              <div className="product_image">
                <Image 
                  src={product.image} 
                  width={357} 
                  height={357} 
                  alt={product.title} 
                />
              </div>
              <div className="product_info">
                <h3 className="product_title small_tr">{product.title}</h3>
                <div className="product_meta">
                  <span className="product_location">{product.location}</span>
                  <span className="product_date">{product.date}</span>
                </div>
                <div className="product_footer">
                  <span className="product_price normal_tb">{product.price}</span>
                  <ul className="product_stats">
                    <li className="view">
                      <p className="icon">
                        <Image src="/images/prod_detail_view.svg" width={14} height={14} alt="조회수" />
                      </p>
                      <span>{product.views}</span>
                    </li>
                    <li className="message">
                      <p className="icon">
                        <Image src="/images/prod_detail_chat.svg" width={12} height={12} alt="메세지" />
                      </p>
                      <span>{product.messages}</span>
                    </li>
                    <li className="like">
                      <p className="icon">
                        <Image src="/images/prod_detail_bookmark.svg" width={14} height={14} alt="즐겨찾기" />
                      </p>
                      <span>{product.likes}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Link>
            
            {/* 더보기 버튼 */}
            <button 
              className="more_btn"
              onClick={() => handleMoreClick(product)}
            >
              ⋯
            </button>
          </li>
        ))}
      </ul>
      {showPopup && (
        <>
          <div className="overlay active" onClick={closePopup}></div>
          
          <div className="more_popup">
            <ul>
              <li>
                <button className="modify_btn" onClick={closePopup}>
                  수정
                </button>
              </li>
              <li>
                <button className="delete_btn" onClick={handleDelete}>
                  삭제
                </button>
              </li>
              <li>
                <button className="soldout_btn" onClick={handleSoldout}>
                  판매완료
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
