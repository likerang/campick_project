/*
 * 파일명: page.js (login.html)
 * 담당자: 박연미
 * 작성일: 2025-09-04
 * 최근 수정일: 2025-09-04
 * 설명: login.html의 next.js 버전
 * 수정이력:
 *  2025-09-04: login.html의 코드 next.js 문법으로 변경
*/
"use client"
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'

import { supabase } from "../../lib/supabaseClient"

// export const metadata = {
//   title: "Campick - 로그인",
//   description: "Welcome to Campick",
// };


export default function Login() {

  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [user, setUser] = useState(null); //로그인한 유저 정보 할당
  const router = useRouter(); //

  useEffect(() => {
    if (user) {
      router.push("/mypage");
    }
  }, [user, router]);

  // 로그인 후 마이페이지로 이동
  useEffect(() => {
    const checkUser = async () => {
      //유저정보 조회
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user);
    }
    checkUser();
  }, []);

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthForm(prev => ({ ...prev, [name]: value }));
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword(authForm)
    if (error) {
      alert('로그인 실패', error.message);
    } else {
      alert('로그인 성공');
      setUser(data.user); //로그인한 유저의 유저 정보 반영
      router.push("/mypage"); // ✅ 로그인 성공 시 바로 /mypage로 이동
    }
  }

  //로그인 전 로그인 폼
  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.logo_section}>
          <div className={styles.logo}>
            <Image
              src="/images/logo_black.png"
              alt="campick logo"
              width={120}
              height={49}
            />
          </div>
          <div className={styles.subtitle}>
            캠핑 <span className={styles.font_primary}>중고거래</span>는 캠픽
            <br />
            캠핑 <span className={styles.font_primary}>트렌드</span>도 캠픽
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className={styles.form_group}>
            <label className={styles.form_label}>이메일</label>
            <input type="email" name="email" className={styles.form_input} placeholder="예) campick@gmail.com" onChange={handleAuthChange} />
          </div>

          <div className={styles.form_group}>
            <label className={styles.form_label}>비밀번호</label>
            <input
              type="password" name="password" className={styles.form_input} placeholder="" onChange={handleAuthChange} />
          </div>

          <button type="submit" className={`${styles.login_btn} btn_normal`}>
            로그인
          </button>

          <div className={styles.links}>
            <Link href="#">이메일 찾기</Link>
            <Link href="#">비밀번호 찾기</Link>
          </div>

          <div className={styles.social_login}>
            <div className={styles.login_title}>
              <div className={styles.border}></div>
              <span>간편 로그인</span>
              <div className={styles.border}></div>
            </div>
            <button type="button" className={`${styles.social_btn} ${styles.naver_btn}`}>
              네이버로 로그인
            </button>

            <button type="button" className={`${styles.social_btn} ${styles.kakao_btn}`}>
              카카오 로그인
            </button>
          </div>
        </form>

        <div className={styles.signup_section}>
          <div className={styles.border}></div>
          <Link href="/join">회원가입</Link>
        </div>
      </div>

    );

  }
  return null;

}