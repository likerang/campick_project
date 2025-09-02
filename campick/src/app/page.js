import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <h1>안녕 반가워?</h1>
      <div className="container">
        <a href="/mypage">마이페이지 이동</a>
      </div>
    </>
  );
}
