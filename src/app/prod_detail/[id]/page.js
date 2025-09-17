/*
 * 파일명: page.js (prod_detail.html)
 * 담당자: 김영태
 * 작성일: 2025-09-04
 * 최근 수정일: 2025-09-04
 * 설명: prod_detail.html의 next.js 버전
 * 수정이력:
 *  2025-09-04: prod_detail.html의 코드 next.js 문법으로 변경
*/
import { createClient } from "../../../utils/supabase/server";
import ProdDetailClient from './component';
import Change from "./change";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css"
export default async function ProdDetail({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: product, error: product_error } = await supabase
    .from("Product")
    .select("*")
    .eq("prod_id", id)
    .single();
  if (product_error || !product) {
    console.error("상품 조회 실패:", product_error?.message);
    return;
  }
  const { data: allProduct, error: all_error } = await supabase
    .from("Product")
    .select();
  if (all_error) {
    console.error("전체 상품 조회 실패:", all_error.message);
  }
  // 4. 상품 조회가 끝난 뒤 -> prod_id 기반으로 채팅룸 조회
  let chatRoom = null;
  let chatRoom_error = null;

  if (product?.prod_id) {
    const { data, error } = await supabase
      .from("ChatRoom")
      .select("*")
      .eq("prod_id", product.prod_id) // ✅ 하드코딩 제거
      .single();
    chatRoom = data;
    chatRoom_error = error;
    if (chatRoom_error) {
      console.error("채팅룸 조회 실패:", chatRoom_error.message);
    }
  }
  console.log('채팅룸', chatRoom);
  const tags = product.tag.split(',');
  const images = product.prod_images.split(',');
  return (
    <>
      {/* product_detail  */}
      <div className={styles.product_detail_content}>
        {/* slide_wrapper(image)  */}
        <div className={styles.product_detail_slider}>
          {/* slide_track  */}
          <ProdDetailClient images={product.prod_images} />
        </div>

        {/* product_detail_info  */}
        <div className={styles.product_detail_info}>
          <span className={`small_tr ${styles.selected_brand}`}>{product.prod_brand}</span>
          <h3 className={styles.product_title}>{product.prod_title}</h3>
          <span className={`medium_tb ${styles.product_price}`}>{product.prod_price.toLocaleString()}원</span>
          <div className="product_meta">
            <span className="product_location">종로1가동</span>
            <span className="product_date">4시간 전</span>
          </div>
          {/* tag_list */}
          {
            // tag에 값이 있으면
            product.tag && (
              <ul className={styles.tag_list}>
                {tags.map((tag, idx) => {
                  return (<li key={idx} className={`xsmall_tr ${styles.tag_item}`}><Link href="/store">{tag}</Link></li>)
                })}
              </ul >
            )
          }

          <div className={styles.product_detail_stats_wrapper}>
            <ul className="product_stats">
              {product.view > 0 && (<li className="view">
                <p className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                    fill="00000">
                    <path
                      d="M480.09-328.92q62.99 0 106.99-44.09 44-44.09 44-107.08 0-62.99-44.09-106.99-44.09-44-107.08-44-62.99 0-106.99 44.09-44 44.09-44 107.08 0 62.99 44.09 106.99 44.09 44 107.08 44ZM480-384q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm.05 172q-134.57 0-245.23-73.12Q124.16-358.23 69.54-480q54.62-121.77 165.22-194.88Q345.37-748 479.95-748q134.57 0 245.23 73.12Q835.84-601.77 890.46-480q-54.62 121.77-165.22 194.88Q614.63-212 480.05-212ZM480-480Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z" />
                  </svg>
                  <span className="ir_pm">조회수</span>
                </p>
                <span>{item.view}</span>
              </li>)}
              <li className="message">
                <p className="icon">
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="path-1-outside-1_686_255" maskUnits="userSpaceOnUse" x="0" y="0.5" width="14"
                      height="16" fill="black">
                      <rect fill="white" y="0.5" width="14" height="16" />
                      <path
                        d="M10.5 5.17578V4H3.5V5.17578H10.5ZM8.17578 8.67578V7.5H3.5V8.67578H8.17578ZM3.5 5.75V6.92578H10.5V5.75H3.5ZM11.6758 1.67578C11.9857 1.67578 12.25 1.79427 12.4688 2.03125C12.7057 2.25 12.8242 2.51432 12.8242 2.82422V9.82422C12.8242 10.1341 12.7057 10.4076 12.4688 10.6445C12.25 10.8815 11.9857 11 11.6758 11H3.5L1.17578 13.3242V2.82422C1.17578 2.51432 1.28516 2.25 1.50391 2.03125C1.74089 1.79427 2.01432 1.67578 2.32422 1.67578H11.6758Z" />
                    </mask>
                    <path
                      d="M10.5 5.17578V6.17578H11.5V5.17578H10.5ZM10.5 4H11.5V3H10.5V4ZM3.5 4V3H2.5V4H3.5ZM3.5 5.17578H2.5V6.17578H3.5V5.17578ZM8.17578 8.67578V9.67578H9.17578V8.67578H8.17578ZM8.17578 7.5H9.17578V6.5H8.17578V7.5ZM3.5 7.5V6.5H2.5V7.5H3.5ZM3.5 8.67578H2.5V9.67578H3.5V8.67578ZM3.5 5.75V4.75H2.5V5.75H3.5ZM3.5 6.92578H2.5V7.92578H3.5V6.92578ZM10.5 6.92578V7.92578H11.5V6.92578H10.5ZM10.5 5.75H11.5V4.75H10.5V5.75ZM12.4688 2.03125L11.7339 2.70953L11.7611 2.73892L11.7905 2.76605L12.4688 2.03125ZM12.4688 10.6445L11.7616 9.93742L11.7475 9.95156L11.7339 9.96625L12.4688 10.6445ZM3.5 11V10H3.08579L2.79289 10.2929L3.5 11ZM1.17578 13.3242H0.175781V15.7384L1.88289 14.0313L1.17578 13.3242ZM1.50391 2.03125L2.21101 2.73836L1.50391 2.03125ZM10.5 5.17578H11.5V4H10.5H9.5V5.17578H10.5ZM10.5 4V3H3.5V4V5H10.5V4ZM3.5 4H2.5V5.17578H3.5H4.5V4H3.5ZM3.5 5.17578V6.17578H10.5V5.17578V4.17578H3.5V5.17578ZM8.17578 8.67578H9.17578V7.5H8.17578H7.17578V8.67578H8.17578ZM8.17578 7.5V6.5H3.5V7.5V8.5H8.17578V7.5ZM3.5 7.5H2.5V8.67578H3.5H4.5V7.5H3.5ZM3.5 8.67578V9.67578H8.17578V8.67578V7.67578H3.5V8.67578ZM3.5 5.75H2.5V6.92578H3.5H4.5V5.75H3.5ZM3.5 6.92578V7.92578H10.5V6.92578V5.92578H3.5V6.92578ZM10.5 6.92578H11.5V5.75H10.5H9.5V6.92578H10.5ZM10.5 5.75V4.75H3.5V5.75V6.75H10.5V5.75ZM11.6758 1.67578V2.67578C11.6892 2.67578 11.6959 2.67703 11.6976 2.67736C11.699 2.67766 11.6985 2.67764 11.6974 2.67716C11.6964 2.67671 11.6983 2.67736 11.7035 2.68117C11.7088 2.68513 11.7193 2.69361 11.7339 2.70953L12.4688 2.03125L13.2036 1.35297C12.8042 0.920339 12.2774 0.675781 11.6758 0.675781V1.67578ZM12.4688 2.03125L11.7905 2.76605C11.8064 2.78075 11.8149 2.79116 11.8188 2.79654C11.8226 2.80171 11.8233 2.80361 11.8228 2.80261C11.8224 2.80154 11.8223 2.80101 11.8226 2.80243C11.823 2.80405 11.8242 2.81078 11.8242 2.82422H12.8242H13.8242C13.8242 2.22264 13.5797 1.6958 13.147 1.29645L12.4688 2.03125ZM12.8242 2.82422H11.8242V9.82422H12.8242H13.8242V2.82422H12.8242ZM12.8242 9.82422H11.8242C11.8242 9.84796 11.8205 9.85791 11.8178 9.86411C11.8144 9.87183 11.8022 9.8969 11.7616 9.93742L12.4688 10.6445L13.1759 11.3516C13.5835 10.944 13.8242 10.4223 13.8242 9.82422H12.8242ZM12.4688 10.6445L11.7339 9.96625C11.7193 9.98217 11.7088 9.99065 11.7035 9.99461C11.6983 9.99842 11.6964 9.99907 11.6974 9.99862C11.6985 9.99814 11.699 9.99812 11.6976 9.99842C11.6959 9.99875 11.6892 10 11.6758 10V11V12C12.2774 12 12.8042 11.7554 13.2036 11.3228L12.4688 10.6445ZM11.6758 11V10H3.5V11V12H11.6758V11ZM3.5 11L2.79289 10.2929L0.468674 12.6171L1.17578 13.3242L1.88289 14.0313L4.20711 11.7071L3.5 11ZM1.17578 13.3242H2.17578V2.82422H1.17578H0.175781V13.3242H1.17578ZM1.17578 2.82422H2.17578C2.17578 2.78945 2.18136 2.77705 2.18183 2.77591C2.18229 2.7748 2.18695 2.76242 2.21101 2.73836L1.50391 2.03125L0.796799 1.32414C0.390147 1.7308 0.175781 2.24962 0.175781 2.82422H1.17578ZM1.50391 2.03125L2.21101 2.73836C2.25154 2.69783 2.2766 2.68555 2.28433 2.6822C2.29052 2.67952 2.30047 2.67578 2.32422 2.67578V1.67578V0.675781C1.72617 0.675781 1.20445 0.916491 0.796799 1.32414L1.50391 2.03125ZM2.32422 1.67578V2.67578H11.6758V1.67578V0.675781H2.32422V1.67578Z"
                      fill="black" mask="url(#path-1-outside-1_686_255)" />
                  </svg>
                  <span className="ir_pm">메세지</span>
                </p>
                <span>1</span>
              </li>
              {product.like > 0 && (<li className="like">
                <p className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                    fill="00000">
                    <path
                      d="M260-174v-557.69q0-27.01 18.65-45.66Q297.3-796 324.31-796h311.38q27.01 0 45.66 18.65Q700-758.7 700-731.69V-174l-220-87.54L260-174Zm52-77 168-67 168 67v-480.69q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H324.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46V-251Zm0-493h336-336Z" />
                  </svg>
                  <span className="ir_pm">즐겨찾기</span>
                </p>
                <span>{item.like}</span>
              </li>)}
            </ul>
            {/* 해당 상품이 로그인된 사용자의 상품이라면 */}
            {user && product.user_id === user.id && (<Change option={product} />)}
          </div >


          <div className={styles.btn_group}>
            {product.prod_status === 0 ? (
              <>
                <button className={styles.soldout} disabled> 판매 완료 </button >
              </>
            ) : (
              <>
                <button className={styles.chat}>
                  <Link href={user && product.user_id === user.id ? "/messages" : chatRoom ? `/chat/${chatRoom.chat_id}` : '#' }>
                    채팅하기
                  </Link>
                </button >
                <button className={styles.pay}><Link href="/payment_select">결제하기</Link></button >
              </>
            )}
          </div >
        </div >

        {/* 상품 추가정보 */}
        < div className={styles.product_detail_extra} >
          <h4 className={`medium_tb ${styles.product_detail_subtitle}`}>상품 정보</h4>
          <div className={styles.product_detail_description}>
            {product.prod_desc}
          </div >
        </div >


        {/* 사용자 프로필(상품 상세페이지 첨부용) */}
        < div className={styles.seller_banner_content} >
          <h2 className={`medium_tb ${styles.seller_banner_title}`}> 판매자 정보</h2 >

          <div className={styles.seller_banner_body}>
            <div className={styles.seller_profile_img}>
              <Image
                src="/images/user_profile_img.jpg"
                width={50}
                height={50}
                alt=""
              />
            </div >

            <div className={styles.seller_info}>
              <div className={styles.info_header}>
                <h4 className={styles.profile_name}> 캠핑마스터</h4 >
                <div className={styles.profile_rating}>
                  <span className={styles.star_icon}>⭐</span >
                  <span className={styles.rating_score}> 4.8</span >
                </div >
              </div >

              <div className={styles.seller_stats}>
                <div className={styles.seller_item}>
                  <span className={styles.seller_article}> 게시글</span >
                  <span className={styles.value} id="seller_article" > 156</span >
                </div >
                <div className={styles.seller_item}>
                  <span className={styles.seller_follower} > 팔로워</span >
                  <span className={styles.value} id="seller_follower" > 1, 240</span >
                </div >
                <div className={styles.seller_item}>
                  <span className={styles.seller_following}> 팔로잉</span >
                  <span className={styles.value} id="seller_following" > 892</span >
                </div >
              </div >
            </div >

            <button className={`xsmall_tr ${styles.follow_btn}`}> 팔로우</button >
          </div >
        </div >
        {/* 사용자 프로필(상품 상세페이지 첨부용)*/}
      </div >
      {/* //product_detail  */}

      {/* recommend_product_content */}
      <div className={styles.recommend_product_content}>
        <h3 className={`medium_tb ${styles.recommend_product_title}`}>이런건 어때요?</h3>
        <ul className={`product_list_wrapper ${styles.product_list_wrapper}`}>
          {/* 상품 카드 1  */}
          {allProduct.slice(0, 6).map(item =>
            <li className="product_card" key={item.prod_id}>
              <Link href={`/prod_detail/${item.prod_id}`}>
                <div className="product_image">
                  <Image
                    src={item.prod_images.split(",")[0]}
                    width={250}
                    height={250}
                    alt=""
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
                      {item.view > 0 && (<li className="view">
                        <p className="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                            fill="00000">
                            <path
                              d="M480.09-328.92q62.99 0 106.99-44.09 44-44.09 44-107.08 0-62.99-44.09-106.99-44.09-44-107.08-44-62.99 0-106.99 44.09-44 44.09-44 107.08 0 62.99 44.09 106.99 44.09 44 107.08 44ZM480-384q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm.05 172q-134.57 0-245.23-73.12Q124.16-358.23 69.54-480q54.62-121.77 165.22-194.88Q345.37-748 479.95-748q134.57 0 245.23 73.12Q835.84-601.77 890.46-480q-54.62 121.77-165.22 194.88Q614.63-212 480.05-212ZM480-480Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z" />
                          </svg>
                          <span className="ir_pm">조회수</span>
                        </p>
                        <span>{item.view}</span>
                      </li>)}
                      <li className="message">
                        <p className="icon">
                          <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="path-1-outside-1_686_255" maskUnits="userSpaceOnUse" x="0" y="0.5" width="14"
                              height="16" fill="black">
                              <rect fill="white" y="0.5" width="14" height="16" />
                              <path
                                d="M10.5 5.17578V4H3.5V5.17578H10.5ZM8.17578 8.67578V7.5H3.5V8.67578H8.17578ZM3.5 5.75V6.92578H10.5V5.75H3.5ZM11.6758 1.67578C11.9857 1.67578 12.25 1.79427 12.4688 2.03125C12.7057 2.25 12.8242 2.51432 12.8242 2.82422V9.82422C12.8242 10.1341 12.7057 10.4076 12.4688 10.6445C12.25 10.8815 11.9857 11 11.6758 11H3.5L1.17578 13.3242V2.82422C1.17578 2.51432 1.28516 2.25 1.50391 2.03125C1.74089 1.79427 2.01432 1.67578 2.32422 1.67578H11.6758Z" />
                            </mask>
                            <path
                              d="M10.5 5.17578V6.17578H11.5V5.17578H10.5ZM10.5 4H11.5V3H10.5V4ZM3.5 4V3H2.5V4H3.5ZM3.5 5.17578H2.5V6.17578H3.5V5.17578ZM8.17578 8.67578V9.67578H9.17578V8.67578H8.17578ZM8.17578 7.5H9.17578V6.5H8.17578V7.5ZM3.5 7.5V6.5H2.5V7.5H3.5ZM3.5 8.67578H2.5V9.67578H3.5V8.67578ZM3.5 5.75V4.75H2.5V5.75H3.5ZM3.5 6.92578H2.5V7.92578H3.5V6.92578ZM10.5 6.92578V7.92578H11.5V6.92578H10.5ZM10.5 5.75H11.5V4.75H10.5V5.75ZM12.4688 2.03125L11.7339 2.70953L11.7611 2.73892L11.7905 2.76605L12.4688 2.03125ZM12.4688 10.6445L11.7616 9.93742L11.7475 9.95156L11.7339 9.96625L12.4688 10.6445ZM3.5 11V10H3.08579L2.79289 10.2929L3.5 11ZM1.17578 13.3242H0.175781V15.7384L1.88289 14.0313L1.17578 13.3242ZM1.50391 2.03125L2.21101 2.73836L1.50391 2.03125ZM10.5 5.17578H11.5V4H10.5H9.5V5.17578H10.5ZM10.5 4V3H3.5V4V5H10.5V4ZM3.5 4H2.5V5.17578H3.5H4.5V4H3.5ZM3.5 5.17578V6.17578H10.5V5.17578V4.17578H3.5V5.17578ZM8.17578 8.67578H9.17578V7.5H8.17578H7.17578V8.67578H8.17578ZM8.17578 7.5V6.5H3.5V7.5V8.5H8.17578V7.5ZM3.5 7.5H2.5V8.67578H3.5H4.5V7.5H3.5ZM3.5 8.67578V9.67578H8.17578V8.67578V7.67578H3.5V8.67578ZM3.5 5.75H2.5V6.92578H3.5H4.5V5.75H3.5ZM3.5 6.92578V7.92578H10.5V6.92578V5.92578H3.5V6.92578ZM10.5 6.92578H11.5V5.75H10.5H9.5V6.92578H10.5ZM10.5 5.75V4.75H3.5V5.75V6.75H10.5V5.75ZM11.6758 1.67578V2.67578C11.6892 2.67578 11.6959 2.67703 11.6976 2.67736C11.699 2.67766 11.6985 2.67764 11.6974 2.67716C11.6964 2.67671 11.6983 2.67736 11.7035 2.68117C11.7088 2.68513 11.7193 2.69361 11.7339 2.70953L12.4688 2.03125L13.2036 1.35297C12.8042 0.920339 12.2774 0.675781 11.6758 0.675781V1.67578ZM12.4688 2.03125L11.7905 2.76605C11.8064 2.78075 11.8149 2.79116 11.8188 2.79654C11.8226 2.80171 11.8233 2.80361 11.8228 2.80261C11.8224 2.80154 11.8223 2.80101 11.8226 2.80243C11.823 2.80405 11.8242 2.81078 11.8242 2.82422H12.8242H13.8242C13.8242 2.22264 13.5797 1.6958 13.147 1.29645L12.4688 2.03125ZM12.8242 2.82422H11.8242V9.82422H12.8242H13.8242V2.82422H12.8242ZM12.8242 9.82422H11.8242C11.8242 9.84796 11.8205 9.85791 11.8178 9.86411C11.8144 9.87183 11.8022 9.8969 11.7616 9.93742L12.4688 10.6445L13.1759 11.3516C13.5835 10.944 13.8242 10.4223 13.8242 9.82422H12.8242ZM12.4688 10.6445L11.7339 9.96625C11.7193 9.98217 11.7088 9.99065 11.7035 9.99461C11.6983 9.99842 11.6964 9.99907 11.6974 9.99862C11.6985 9.99814 11.699 9.99812 11.6976 9.99842C11.6959 9.99875 11.6892 10 11.6758 10V11V12C12.2774 12 12.8042 11.7554 13.2036 11.3228L12.4688 10.6445ZM11.6758 11V10H3.5V11V12H11.6758V11ZM3.5 11L2.79289 10.2929L0.468674 12.6171L1.17578 13.3242L1.88289 14.0313L4.20711 11.7071L3.5 11ZM1.17578 13.3242H2.17578V2.82422H1.17578H0.175781V13.3242H1.17578ZM1.17578 2.82422H2.17578C2.17578 2.78945 2.18136 2.77705 2.18183 2.77591C2.18229 2.7748 2.18695 2.76242 2.21101 2.73836L1.50391 2.03125L0.796799 1.32414C0.390147 1.7308 0.175781 2.24962 0.175781 2.82422H1.17578ZM1.50391 2.03125L2.21101 2.73836C2.25154 2.69783 2.2766 2.68555 2.28433 2.6822C2.29052 2.67952 2.30047 2.67578 2.32422 2.67578V1.67578V0.675781C1.72617 0.675781 1.20445 0.916491 0.796799 1.32414L1.50391 2.03125ZM2.32422 1.67578V2.67578H11.6758V1.67578V0.675781H2.32422V1.67578Z"
                              fill="black" mask="url(#path-1-outside-1_686_255)" />
                          </svg>
                          <span className="ir_pm">메세지</span>
                        </p>
                        <span>1</span>
                      </li>
                      {item.like > 0 && (<li className="like">
                        <p className="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                            fill="00000">
                            <path
                              d="M260-174v-557.69q0-27.01 18.65-45.66Q297.3-796 324.31-796h311.38q27.01 0 45.66 18.65Q700-758.7 700-731.69V-174l-220-87.54L260-174Zm52-77 168-67 168 67v-480.69q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H324.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46V-251Zm0-493h336-336Z" />
                          </svg>
                          <span className="ir_pm">즐겨찾기</span>
                        </p>
                        <span>{item.like}</span>
                      </li>)}
                    </ul>
                  </div>
                </div>
              </Link>
            </li>
          )}
        </ul>
        <button className="more_btn">더 보기</button>
      </div>
      {/*  //recommend_product_content  */}


      {/* common_caution_banner */}
      <div className="caution_banner">
        <Image
          src="/images/banner_icon.png"
          width={73}
          height={72}
          alt="banner_icon"
        />
        <div className="caution_desc">
          <h3 className="medium_tb">잠시만요 !</h3>
          <p className="normal_tb">안전하고 쾌적한 캠핑을 위한 사용법, 함께 확인해요.</p>
          <a href="#" className="xsmall_tr">
            거래 금지 품목 알아보기
            <span>
              <Image
                src="/images/banner_small_arrow.svg"
                width={8}
                height={7}
                alt="화살표"
              />
            </span>
          </a>
        </div>
      </div>
      {/* //common_caution_banner */}
    </>
  )
}