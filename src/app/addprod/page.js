/*
 * 파일명: page.js (add_prod.html)
 * 담당자: 김영태
 * 작성일: 2025-09-04
 * 최근 수정일: 2025-09-04
 * 설명: add_prod.html의 next.js 버전
 * 수정이력:
 *  2025-09-04: add_prod.html의 코드 next.js 문법으로 변경
*/
"use client";
import { createClient } from '../../utils/supabase/client';
import Image from "next/image";
import Link from 'next/link';
import styles from './page.module.css'
import { useState } from 'react';

// export const metadata = {
//   title: "Campick - 상품등록",
//   description: "Welcome to Campick",
// };

export default function AddProd() {
  const supabase = createClient()
  const [prodData, setProdData] = useState({
    prod_title: "",
    prod_price: "",
    prod_category: "테스트",
    prod_brand: "테스트",
    prod_condition: "",
    warranty: "",
    prod_desc: "",
    trade_method: ["delivery"],
    tag: "테스트1,테스트2,테스트3",
    prod_images: [],
  });

  const handleChange = (evt) => {
    const { name, value, type, checked } = evt.target
    console.log(name);
    console.log(value);
    console.log(type);
    console.log(checked);

    if (type === "checkbox") {
      setProdData((prev) => {
        let trade_method = [...prev.trade_method];
        if (checked) {
          trade_method.push(value);
        } else {
          trade_method = trade_method.filter((m) => m !== value);
        }
        return { ...prev, trade_method };
      });
    } else {
      setProdData((prev) => ({ ...prev, [name]: value }));
    }
    console.log(prodData);
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const { error } = await supabase.from("Product").insert({
      prod_title: prodData.prod_title,
      prod_price: Number(prodData.prod_price),
      prod_category: prodData.prod_category,
      prod_brand: prodData.prod_brand,
      prod_condition: prodData.prod_condition,
      warranty: prodData.warranty,
      prod_desc: prodData.prod_desc,
      trade_method: prodData.trade_method.join(","), // 배열 → 문자열 저장
      tag: prodData.tag,
      prod_images: prodData.prod_images.join(",")
    });
    if (error) {
      console.error(error);
      alert("상품 등록 중 오류가 발생했습니다.");
    } else {
      alert("상품이 성공적으로 등록되었습니다!");
      setProdData({
        prod_title: "",
        prod_price: "",
        prod_category: "",
        prod_brand: "",
        prod_condition: "",
        warranty: "",
        prod_desc: "",
        trade_method: [],
        tag: "",
        prod_images: "",
      });
    }
  };

  const handleFileChange = async (evt) => {
    const files = evt.target.files;
    if (!files || files.length === 0) return;

    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${Date.now()}_${file.name}`; // 파일명 충돌 방지

      // ✅ Supabase Storage에 업로드
      const { error } = await supabase.storage
        .from("prod_images") // 👉 Storage 버킷명 (미리 생성 필요)
        .upload(fileName, file);

      if (error) {
        console.error("이미지 업로드 실패:", error.message);
        continue;
      }

      // ✅ 업로드 후 Public URL 가져오기
      const { data } = supabase.storage
        .from("prod_images")
        .getPublicUrl(fileName);

      if (data?.publicUrl) {
        uploadedUrls.push(data.publicUrl);
      }
    }

    // ✅ setProdData 이미지 URL 저장
    setProdData((prev) => ({
      ...prev,
      prod_images: [...prev.prod_images, ...uploadedUrls],
    }));
  };

  // 이미지 삭제 함수 추가
  const removeImage = (indexToRemove) => {
    setProdData((prev) => ({
      ...prev,
      prod_images: prev.prod_images.filter((_, index) => index !== indexToRemove)
    }));
  };

  return (
    <>
      {/* form  */}
      <div className={styles.form_content}>
        <h2 className={styles.form_title}>내 상품 판매하기</h2>
        <form className={styles.form_style} onSubmit={handleSubmit}>
          {/* 사진 업로드  */}
          <div className={styles.image_upload}>
            <label htmlFor="imageInput" className={styles.upload_box}>
              <span className={styles.upload_icon} aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px"
                  fill="#939393">
                  <path
                    d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Z" />
                </svg>
              </span>
              <span className={`small_tr ${styles.upload_img_count}`}>0/10</span>
            </label>
            <input type="file" id="imageInput" multiple accept="image/*" onChange={handleFileChange} hidden />
          </div>

          {prodData.prod_images.length > 0 &&
            (
              <div className={styles.uploaded_image_box}>
                {prodData.prod_images.slice(0, 10).map((imageUrl, index) => (
                  <div key={index} className={styles.uploaded_image_item}>
                    <Image
                      src={imageUrl}
                      width={80}
                      height={80}
                      alt={`업로드된 이미지 ${index + 1}`}
                    />
                    <button
                      type="button"
                      className={styles.remove_image_btn}
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )
          }

          {/* 상품명 */}
          <div className={styles.product_title}>
            <label className="ir_pm" htmlFor="prod_title">상품명</label>
            <input className={styles.label_box} type="text" id="prod_title" placeholder="상품명" name="prod_title" onChange={handleChange} required />
          </div>

          {/* 판매 가격  */}
          <div className={styles.product_pirce}>
            <label className="ir_pm" htmlFor="prod_price">판매 가격</label>
            <input className={styles.label_box} type="text" id="prod_price" placeholder="판매 가격" name="prod_price" onChange={handleChange} required />
          </div>

          {/* 카테고리 */}
          <div className={styles.product_category}>
            <button type="button" className={styles.category_btn}>카테고리</button>
          </div>

          {/* 브랜드  */}
          <div className={styles.product_brand}>
            <button type="button" className={styles.brand_btn}>브랜드</button >
          </div >

          {/* 제품 상태  */}
          < div className={styles.product_status}>
            <h3 className={`normal_tb ${styles.product_status_title} ${styles.title}`}> 제품 상태</h3 >
            <div className={styles.product_status_checkbox}>
              <input type="radio" name="prod_condition" value="new" id="new" onChange={handleChange} />
              <label className="small_tr" htmlFor="new">미개봉</label>

              <input type="radio" name="prod_condition" value="good" id="good" onChange={handleChange} defaultChecked />
              <label className="small_tr" htmlFor="good">양호</label>

              <input type="radio" name="prod_condition" value="normal" id="normal" onChange={handleChange} />
              <label className="small_tr" htmlFor="normal"> 보통</label>

              <input type="radio" name="prod_condition" value="used" id="used" onChange={handleChange} />
              <label className="small_tr" htmlFor="used"> 사용감 있음</label>

              <input type="radio" name="prod_condition" value="repair" id="repair" onChange={handleChange} />
              <label className="small_tr" htmlFor="repair"> 수리/수선 필요</label>
            </div >
          </div >

          {/* 보증서 유무  */}
          < div className={styles.warranty_status} >
            <h3 className={`normal_tb ${styles.warranty_status_title} ${styles.title}`}> 보증서 유무</h3 >
            <div className={styles.warranty_status_checkbox}>
              <input type="radio" name="warranty" value="yes" id="yes" onChange={handleChange} defaultChecked />
              <label className="small_tr" htmlFor="yes"> 유</label>

              <input type="radio" name="warranty" value="no" id="no" onChange={handleChange} />
              <label className="small_tr" htmlFor="no"> 무</label>
            </div >
          </div >

          {/* 자세한 설명  */}
          < div className={styles.product_description} >
            <h3 className={`normal_tb ${styles.product_description_title} ${styles.title}`}> 자세한 설명</h3 >
            <textarea id="prod_desc" className={styles.product_extra} name="prod_desc" rows="6" onChange={handleChange}
              placeholder="구매자가 알아야 할 정보를 입력해주세요.&#10;- 사용감(스크래치, 얼룩, 하자부분 등)&#10;- 사용기간(구매 시기 등)&#10;- 고장, 파손, 염색 등 하자 정보는 꼭 기재해주세요!" ></textarea >
          </div >

          {/* 거래 방식  */}
          < div className={styles.trade_status} >
            <h3 className={`normal_tb ${styles.trade_title} ${styles.title}`}> 거래 방식</h3 >
            <div className={styles.trade_checkbox}>
              <input type="checkbox" name="trade_method" value="delivery" id="delivery" onChange={handleChange} defaultChecked />
              <label className="small_tr" htmlFor="delivery"> 택배</label>
              <input type="checkbox" name="trade_method" value="direct" id="direct" onChange={handleChange} />
              <label className="small_tr" htmlFor="direct">직거래</label>
            </div >
          </div >

          {/* 태그(선택 사항) */}
          < div className={styles.product_tag}>
            <h3 className={`normal_tb ${styles.product_tag_title} ${styles.title}`}> 태그(선택 사항) < span className="xsmall_tr" > 최대 10개</span ></h3 >
            <div className={styles.product_tag_content}>
              <div className={styles.product_tag_input}>
                <input type="text" id="tagInput" className={styles.tag_input} placeholder="예시 '새상품', '미개봉'" />
                <button type="button" className={`small_tr ${styles.tag_add_btn}`}> 추가</button >
              </div >
              <ul className={styles.tag_list}>
                <li className={`small_tr ${styles.tag_item} `}>
                  <span>새상품</span>
                  <button className={styles.tag_delete_btn}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px"
                      fill="#939393">
                      <path
                        d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                    </svg>
                  </button >
                </li >
                <li className={`small_tr ${styles.tag_item}`}>
                  <span>미개봉</span>
                  <button className={styles.tag_delete_btn}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px"
                      fill="#939393">
                      <path
                        d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                    </svg>
                  </button >
                </li >
                <li className={`small_tr ${styles.tag_item}`}>
                  <span>여름용</span>
                  <button className={styles.tag_delete_btn}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px"
                      fill="#939393">
                      <path
                        d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                    </svg>
                  </button >
                </li >
              </ul >
            </div >
          </div >

          <button type="submit" className={styles.submit_button}> 상품등록</button >
        </form >
      </div >
      {/* //form  */}


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