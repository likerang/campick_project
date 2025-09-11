/*
 * 파일명: page.js (messages.html)
 * 담당자: 김영태
 * 작성일: 2025-09-04
 * 최근 수정일: 2025-09-04
 * 설명: messages.html의 next.js 버전
 * 수정이력:
 *  2025-09-04: messages.html의 코드 next.js 문법으로 변경
*/
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css"
import { createClient } from "../../utils/supabase/server";

export const metadata = {
  title: "Campick - 메세지",
  description: "Welcome to Campick",
};


// const { data: chat, error: chat_error } = await supabase
//   .from("ChatRoom")
//   .select()
//   .or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`);

export default async function messages() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser(); // 유저 정보 조회
  const { data: seller_chat, error: seller_error } = await supabase // 내가 판매자인 채팅
    .from("ChatRoom")
    .select()
    .eq("seller_id", user.id);
  const { data: buyer_chat, error: buyer_error } = await supabase // 내가 구매자인 채팅
    .from("ChatRoom")
    .select()  // select()를 먼저
    .eq("buyer_id", user.id);  // 그 다음 조건
  const { data: product, error: product_error } = await supabase // 상품 정보 가져오기
    .from("Product")
    .select()
  console.log("내가 판매하는 채팅", seller_chat);
  console.log("내가 구매하는 채팅", buyer_chat);
  console.log("상품의 전체 정보", product);
  return (
    <>
      {/* user_profile mypage.ver  */}
      <div className="user_profile_wrapper">
        <div className="profile_card">
          <div className="profile_img_wrapper">
            <Image
              src="/images/user_profile_img.jpg"
              width={72}
              height={72}
              alt=""
            />
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
      {/* //user_profile mypage.ver */}

      {/* tab_menu_title */}
      <ul className={styles.tab_menu}>
        <li className={`medium_tr active ${styles.tab_menu_title}`}>
          <h3><a href="">전체</a></h3>
        </li >
        <li className={`medium_tr ${styles.tab_menu_title}`}>
          <h3><a href="">판매</a></h3>
        </li >
        <li className={`medium_tr ${styles.tab_menu_title}`}>
          <h3><a href="">구매</a></h3>
        </li >
      </ul >
      {/* //tab_menu_title  */}

      {/*  tab_menu_content  */}
      <ul className={styles.chat_list}>
        {seller_chat.map((item, idx) => {
          const fd = product.filter(p => { return p.prod_id === item.prod_id; }) //prod_id값이 같은것 찾기
          return (
            <li key={idx} className={`${styles.chat_item} ${styles.message}`}>
              <Link className={styles.chat_link} href={`/chat/${item.chat_id}`}>
                <div className={styles.chat_thumbnail}>
                  <Image
                    className={styles.product_thumb}
                    src={fd[0].prod_images.split(",")[0]}
                    width={64}
                    height={64}
                    alt=""
                  />
                  <Image
                    className={styles.user_thumb}
                    src="/images/user_profile_img.jpg"
                    width={48}
                    height={48}
                    alt=""
                  />
                </div >
                <div className={styles.chat_info}>
                  <h4 className={`small_tr ${styles.chat_userid}`}>캠핑이조아랑</h4 >
                  <p className={`xsmall_tr ${styles.chat_message}`}> 안녕하세요! 오늘 직거래 가능 한가요 ?</p >
                  <span className={styles.chat_time} > 30분 전</span >
                  {/* <!-- ::after --> */}
                </div >
              </Link >
            </li >
          )
        })}
      </ul>
      {/* //tab_menu_content  */}
    </>
  )
}