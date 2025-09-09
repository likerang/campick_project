/*
 * 파일명: page.js (payment_modal.html)
 * 담당자: 박연미
 * 작성일: 2025-09-04
 * 최근 수정일: 2025-09-04
 * 설명: payment_modal.html의 next.js 버전
 * 수정이력:
 *  2025-09-04: payment_modal.html의 코드 next.js 문법으로 변경
*/

import Image from "next/image";
import Link from 'next/link';

import styles from "./page.module.css"

export const metadata = {
	title: "Campick - 결제 모달",
	description: "Welcome to Campick",
};


export default function PaymentModal() {
  return (
    <>
      <div className={styles.overlay}></div>

      <div className={styles.modal}>
        <div className={styles.modal_header}>
          <button className={styles.close_button}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#222222"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </button>

          <div className={styles.chat_icon}>
            <div className={styles.chat_bubble}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#222222"
              >
                <path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.modal_content}>
          <h2 className={styles.modal_title}>잠깐 판매자와 채팅 하셨나요?</h2>

          <p className={styles.modal_description}>
            제품을 하지 않고 결제하면 취소될 확률이 높아요.<br />
            채팅을 통해 판매자와 소통해 보세요.
          </p>

          <div className={styles.button_group}>
            <Link href="/chat" className="btn_normal">
              채팅하고 거래할래요.
            </Link>
            <a href="/payment_select" className={styles.secondary_button}>
              채팅없이 거래할래요.
            </a>
          </div>
        </div>
      </div>
    </>
  );
}