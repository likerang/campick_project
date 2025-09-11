import Image from "next/image";

export default function PreparingPage({ title }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center'
        }}
      >
        <Image
          src="/images/store_logo_small.svg"
          alt="검색 결과 없음"
          width={35}
          height={54}
        />
        <br/>
        <h1>{title}</h1>
        <p>🚧 준비중입니다 🚧</p>
    </div>
  );
}