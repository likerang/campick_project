import { createClient } from "../utils/supabase/server";
import AddProdButton from "./AddProdButton";
import "./css/reset.css";
import "./globals.css";
import "./css/header.css";
import "./css/footer.css";

import HeaderClient from "./HeaderClient";

export const metadata = {
  title: "Campick",
  description: "Welcome to Campick",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  apple: [
    { url: "/favicon/apple-icon-57x57.png", sizes: "57x57" },
    { url: "/favicon/apple-icon-60x60.png", sizes: "60x60" },
    { url: "/favicon/apple-icon-72x72.png", sizes: "72x72" },
    { url: "/favicon/apple-icon-76x76.png", sizes: "76x76" },
    { url: "/favicon/apple-icon-114x114.png", sizes: "114x114" },
    { url: "/favicon/apple-icon-120x120.png", sizes: "120x120" },
    { url: "/favicon/apple-icon-144x144.png", sizes: "144x144" },
    { url: "/favicon/apple-icon-152x152.png", sizes: "152x152" },
    { url: "/favicon/apple-icon-180x180.png", sizes: "180x180" },
    { url: "/favicon/apple-touch-icon.png" },
  ],
  manifest: "/favicon/manifest.json",
};

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="ko">
      <body>
        <div className="container">
          {/* 상품등록 버튼 */}
          <AddProdButton />
          {/* 헤더 */}
          <HeaderClient serverUser={user} />
          {/* 메인 */}
          <main>{children}</main>
          {/* 푸터 */}
          <footer>
            <div className="footer_logo">
              <a href="/">
                <img
                  src="/images/logo_white.png"
                  alt="campick logo"
                  width={168}
                  height={69}
                />
                <span className="ir_pm">campick</span>
              </a>
            </div>
            <nav>
              <ul className="nav_links small_tb">
                <li><a href="/terms"><span>이용약관</span></a></li>
                <li><a href="/privacy"><span>개인정보처리방침</span></a></li>
                <li><a href="/guide"><span>이용안내</span></a></li>
                <li><a href="/notice"><span>공지사항</span></a></li>
                <li><a href="/content"><span>콘텐츠</span></a></li>
                <li><a href="/partnership"><span>입점/제휴문의</span></a></li>
              </ul>
            </nav>
            <div className="footer_content small_tr">
              <div className="company_info">
                <h3 className="company_name small_tb">(주)캠픽</h3>
                <div className="company_details">
                  <p>사업자등록번호:456-25-46512 | 대표:허석윤, 이희재</p>
                  <p>통신판매업신고:2025-서울중부-3256호 | 서울시영등포구청</p>
                  <address>본사:서울 영등포구 0452-0684(예금주:주식회사 캠픽)</address>
                  <address>주소:서울특별시 중구로 수표로 96, 2층 (국일빌딩멜파스)</address>
                  <p>비즈니스 문의:<a href="mailto:abiz@campick.co">abiz@campick.co</a></p>
                </div>
              </div>
              <div className="customer_service">
                <h3 className="service_title small_tb">고객센터</h3>
                <div className="service_details">
                  <p>평일 : 11:00 ~ 17:00</p>
                  <p>점심시간 : 13:00 ~ 14:00</p>
                  <p>주말 및 공휴일은 휴무</p>
                  <p>전화 : 02-722-2111</p>
                  <p>메일 : <a href="mailto:help@campick.co">help@campick.co</a></p>
                </div>
              </div>
            </div>
            <div className="disclaimer_area">
              <p className="disclaimer small_tr">
                주식회사 캠픽은 입점 상품을 제외하고 통신판매 중개자로서 통신판매의 당사자가 아닙니다.<br />
                상품, 상품정보, 거래에 관한 의무와 책임은 각 판매자에게 있습니다. 각 상품 페이지에서 구체적인 내용을 확인 부탁드립니다.
              </p>
              <div className="footer_button_group">
                <button className="footer_button small_tr btn_primary">자주하는 질문</button>
                <button className="footer_button small_tr btn_primary">1:1 문의하기</button>
              </div>
            </div>
            <p className="copyright small_tb">
              Copyright © 캠픽 아웃도어. All rights reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
