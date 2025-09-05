'use client';

import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

import styles from "./page.module.css";

// 환경 변수 검증
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

function timeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return "방금 전";
}

export default function Salelist() {
  const [activeTab, setActiveTab] = useState('selling');
  const [popupState, setPopupState] = useState('hidden');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* DB > 상품 불러오기 */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let { data, error } = await supabase
          .from("Product")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("상품 불러오기 실패:", error.message, error.status, error.details);
          console.log("더미 데이터를 사용합니다.");
        }

        if (!data || !Array.isArray(data)) {
          console.warn("데이터가 없거나 올바르지 않습니다:", data);
          setProducts([]);
          return;
        }

        const mapped = data.map((p) => ({
          id: p.prod_id,
          title: p.prod_title,
          price: `${(p.prod_price || 0).toLocaleString()} 원`,
          location: p.location || "지역 없음",
          date: timeAgo(p.created_at),
          image: p.prod_images,
          views: p.view || 0,
          messages: Math.floor(Math.random() * 5),
          likes: p.like || 0,
          isSoldout: p.prod_status === 0,
        }));

        setProducts(mapped);
      } catch (err) {
        console.error("상품 불러오기 중 오류:", err);
        setError("상품을 불러오는 중 오류가 발생했습니다.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* 탭 클릭 */
  function handleTabClick(tabName) {
    setActiveTab(tabName);
  }

  /* 더보기 클릭 */
  function handleMoreClick(product) {
    setSelectedProduct(product);

    if (popupState === 'active') {
      setPopupState('closing');
      setTimeout(() => {
        setPopupState('mounting');
        setTimeout(() => setPopupState('active'), 10);
      }, 300);
    } else {
      setPopupState('mounting');
      setTimeout(() => setPopupState('active'), 10);
    }
  }

  /* 팝업 닫기 */
  function closePopup() {
    setPopupState('closing');
    setTimeout(() => {
      setPopupState('hidden');
      setSelectedProduct(null);
    }, 300);
  }

  /* 판매완료 클릭 */
  async function handleSoldout() {
    if (selectedProduct) {
      try {
        // ✅ DB에서 상태 업데이트
        const { error } = await supabase
          .from('Product')
          .update({ prod_status: 0 }) // 0 = 판매완료
          .eq('prod_id', selectedProduct.id);
        
        if (error) {
          console.error('상태 변경 실패:', error);
          alert('상태 변경에 실패했습니다.');
          return;
        }

        // ✅ 로컬 상태 업데이트
        const updatedProducts = products.map(product => {
          if (product.id === selectedProduct.id) {
            return { ...product, isSoldout: true };
          }
          return product;
        });
        setProducts(updatedProducts);

        setActiveTab('soldout');
        closePopup();
      } catch (err) {
        console.error('상태 변경 중 오류:', err);
        alert('상태 변경 중 오류가 발생했습니다.');
      }
    }
  }

  /* 재판매 클릭 */
  async function handleResale() {
    if (selectedProduct) {
      try {
        // ✅ DB에서 상태 업데이트
        const { error } = await supabase
          .from('Product')
          .update({ prod_status: 1 }) // 1 = 판매중
          .eq('prod_id', selectedProduct.id);
        
        if (error) {
          console.error('상태 변경 실패:', error);
          alert('상태 변경에 실패했습니다.');
          return;
        }

        // ✅ 로컬 상태 업데이트
        const updatedProducts = products.map(product => {
          if (product.id === selectedProduct.id) {
            return { ...product, isSoldout: false };
          }
          return product;
        });
        setProducts(updatedProducts);

        setActiveTab('selling');
        closePopup();
      } catch (err) {
        console.error('상태 변경 중 오류:', err);
        alert('상태 변경 중 오류가 발생했습니다.');
      }
    }
  }

  /* 삭제 클릭 */
  function handleDelete() {
    if (selectedProduct && confirm('정말 삭제하시겠습니까?')) {
      const updatedProducts = products.filter(p => p.id !== selectedProduct.id);
      setProducts(updatedProducts);

      closePopup();
    }
  }

  const displayProducts = products.filter(product => {
    if (activeTab === 'selling') return !product.isSoldout;
    return product.isSoldout;
  });

  // ✅ 로딩 상태 처리
  if (loading) {
    return (
      <div className="salelist_page">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>상품을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // ✅ 에러 상태 처리
  if (error) {
    return (
      <div className="salelist_page">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>오류: {error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

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
                <p className="stat_number">{products.length}</p>
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

      <div className={styles.tab_menu}>
        <Link 
          href="#" 
          className={activeTab === 'selling' ? styles.active : ''} 
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('selling');
          }}>
          판매중
        </Link>
        <Link 
          href="#" 
          className={activeTab === 'soldout' ? styles.active : ''} 
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('soldout');
          }}>
          결제완료
        </Link>
      </div>

      <ul className={styles.product_list_wrapper_2col}>
        {displayProducts.length === 0 && activeTab === 'soldout' ? (
          <li className="no_result">
            <Image
              src="/images/store_logo_small.svg"
              alt="검색 결과 없음"
              width={35}
              height={54}
            />
            <p className="small_tb">판매 완료된 상품이 없습니다.</p>
          </li>
        ) : displayProducts.length === 0 ? (
          <li className="no_result">
            <Image
              src="/images/store_logo_small.svg"
              alt="검색 결과 없음"
              width={35}
              height={54}
            />
            <p className="small_tb">등록된 상품이 없습니다.</p>
          </li>
        ) : (
          displayProducts.map((product) => (
            <li 
              key={product.id} 
              className={`${styles.product_card_2col} ${product.isSoldout ? styles.disable : ''}`}
            >
              <Link href="#">
                {product.isSoldout && 
                <div className={styles.soldout_badge}>판매 완료</div>}
                <div className={styles.product_image}>
                  <Image 
                    src={product.image} 
                    width={357} 
                    height={357} 
                    alt={product.title}
                    onError={(e) => {
                      e.target.src = '/images/default-product.jpg'; // ✅ 이미지 로드 실패 시 기본 이미지
                    }}
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
                className={styles.more_btn}
                onClick={() => handleMoreClick(product)}
              >
                ⋯
              </button>
            </li>
          ))
        )}
      </ul>
      
      {(popupState !== 'hidden') && (
        <>
          <div className="overlay active" onClick={closePopup}></div>
          
          <div className={`more_popup ${popupState === 'active' ? 'active' : ''}`}>
            <ul>
              <li>
                <button className="modify_btn small_tb" onClick={closePopup}>
                  수정
                </button>
              </li>
              <li>
                <button className="delete_btn small_tb" onClick={handleDelete}>
                  삭제
                </button>
              </li>
              {selectedProduct && !selectedProduct.isSoldout ? (
                <li>
                  <button className="soldout_btn small_tb" onClick={handleSoldout}>
                    판매완료
                  </button>
                </li>
              ) : selectedProduct && (
                <li>
                  <button className="resale_btn small_tb" onClick={handleResale}>
                    재판매
                  </button>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}