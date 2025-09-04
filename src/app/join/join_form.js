import Image from "next/image";
import Link from 'next/link';

import "../css/join_form.css";

export const metadata = {
	title: "Campick - 회원가입",
	description: "Welcome to Campick",
};


export default function JoinForm() {
	return (
		<>

			<Head>
				<title>Campick | 회원가입</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>

			<div className="container">
				<div className="logo">
					<div className="flame_icon">
						<div className="flame">
							<Image
								src="/images/logo_white 2.jpg"
								alt="Campick Logo"
								width={60}
								height={60}
								priority
							/>
						</div>
					</div>
					<h1 className="app_title">회원가입</h1>
				</div>

				<div className="signup_section">
					<div className="general_signup">
						<p className="section_title medium_tr">일반 회원가입</p>
						<Link href="/join_member" className="signup_button btn_normal">
							이메일 회원가입
						</Link>
					</div>

					<div className="social_signup">
						<p className="section_title medium_tr">간편 회원가입</p>
						<div className="social_buttons">
							<button
								className="social_button kakao"
								onClick={() => handleSocialLogin('kakao')}
								type="button"
							>
								<Image
									src="/images/kakao_logo.png"
									alt="카카오 로그인"
									width={24}
									height={24}
								/>
							</button>
							<button
								className="social_button naver"
								onClick={() => handleSocialLogin('naver')}
								type="button"
							>
								<Image
									src="/images/naver_logo.png"
									alt="네이버 로그인"
									width={24}
									height={24}
								/>
							</button>
							<button
								className="social_button google"
								onClick={() => handleSocialLogin('google')}
								type="button"
							>
								<Image
									src="/images/google_logo.png"
									alt="구글 로그인"
									width={24}
									height={24}
								/>
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

