'use client';

/*
 * 파일명: page.js (join_member.html)
 * 담당자: 박연미
 * 작성일: 2025-09-04
 * 최근 수정일: 2025-09-08
 * 설명: join_member.html의 next.js 버전 + Supabase 연동
 * 수정이력:
 *  2025-09-04: join_member.html의 코드 next.js 문법으로 변경
 *  2025-09-08: Supabase 회원가입 기능 추가
*/

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import styles from './page.module.css';

// Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function JoinFormPage() {
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    verificationCode: ''
  });

  // 약관 동의 상태
  const [agreements, setAgreements] = useState({
    allAgree: false,
    ageCheck: false,
    termsCheck: false,
    privacyCheck: false,
    privacyOptional: false,
    marketingCheck: false
  });

  // 오류 상태
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 유효성 검사 규칙
  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: '올바른 이메일 주소를 입력해주세요.'
    },
    nickname: {
      required: true,
      minLength: 2,
      message: '닉네임은 2자 이상 입력해주세요.'
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: '비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.'
    },
    passwordConfirm: {
      required: true,
      message: '비밀번호가 일치하지 않습니다.'
    },
    phone: {
      required: true,
      pattern: /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/,
      message: '올바른 휴대폰 번호를 입력해주세요.'
    },
    verificationCode: {
      required: true,
      message: '인증번호를 입력해주세요.'
    }
  };

  // 입력값 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 실시간 유효성 검사
    if (errors[name]) {
      validateField(name, value);
    }
  };

  // 개별 필드 유효성 검사
  const validateField = (fieldName, value) => {
    const rule = validationRules[fieldName];
    if (!rule) return true;

    // 필수 필드 체크
    if (rule.required && !value.trim()) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: `${getFieldLabel(fieldName)}을(를) 입력해주세요.`
      }));
      return false;
    }

    // 값이 있을 때만 추가 검증
    if (value.trim()) {
      // 최소 길이 체크
      if (rule.minLength && value.length < rule.minLength) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: rule.message
        }));
        return false;
      }

      // 패턴 체크
      if (rule.pattern && !rule.pattern.test(value)) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: rule.message
        }));
        return false;
      }

      // 비밀번호 확인 체크
      if (fieldName === 'passwordConfirm') {
        if (value !== formData.password) {
          setErrors(prev => ({
            ...prev,
            [fieldName]: rule.message
          }));
          return false;
        }
      }
    }

    // 유효성 검사 통과시 오류 제거
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    return true;
  };

  // 필드 라벨 반환
  const getFieldLabel = (fieldName) => {
    const labels = {
      email: '이메일',
      nickname: '닉네임',
      password: '비밀번호',
      passwordConfirm: '비밀번호 확인',
      phone: '휴대폰 번호',
      verificationCode: '인증번호'
    };
    return labels[fieldName];
  };

  // 약관 동의 처리
  const handleAgreementChange = (name, checked) => {
    if (name === 'allAgree') {
      // 전체 동의 클릭시
      setAgreements({
        allAgree: checked,
        ageCheck: checked,
        termsCheck: checked,
        privacyCheck: checked,
        privacyOptional: checked,
        marketingCheck: checked
      });
    } else {
      // 개별 약관 클릭시
      const newAgreements = {
        ...agreements,
        [name]: checked
      };

      // 모든 개별 약관이 체크되었는지 확인
      const individualChecks = ['ageCheck', 'termsCheck', 'privacyCheck', 'privacyOptional', 'marketingCheck'];
      const allChecked = individualChecks.every(key => newAgreements[key]);
      
      newAgreements.allAgree = allChecked;
      setAgreements(newAgreements);
    }
  };

  // 필수 약관 동의 체크
  const validateRequiredTerms = () => {
    const requiredTerms = ['ageCheck', 'termsCheck', 'privacyCheck'];
    const uncheckedRequired = requiredTerms.filter(term => !agreements[term]);
    
    if (uncheckedRequired.length > 0) {
      setErrors(prev => ({
        ...prev,
        terms: '필수 약관에 동의해주세요.'
      }));
      return false;
    }
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.terms;
      return newErrors;
    });
    return true;
  };

  // 폼 전체 유효성 검사
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // 모든 입력 필드 검사
    Object.keys(formData).forEach(fieldName => {
      if (!validateField(fieldName, formData[fieldName])) {
        isValid = false;
      }
    });

    // 필수 약관 동의 검사
    if (!validateRequiredTerms()) {
      isValid = false;
    }

    return isValid;
  };

  // 회원가입 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // 첫 번째 오류 필드로 스크롤
      const firstErrorField = document.querySelector('.error, .error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Supabase Auth를 통한 회원가입
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nickname: formData.nickname,
            phone: formData.phone,
            marketing_agree: agreements.marketingCheck,
            privacy_optional_agree: agreements.privacyOptional
          }
        }
      });

      if (error) {
        throw error;
      }

      // 회원가입 성공
      alert('회원가입이 완료되었습니다! 이메일을 확인해주세요.');
      
      // 폼 초기화
      setFormData({
        email: '',
        nickname: '',
        password: '',
        passwordConfirm: '',
        phone: '',
        verificationCode: ''
      });
      
      setAgreements({
        allAgree: false,
        ageCheck: false,
        termsCheck: false,
        privacyCheck: false,
        privacyOptional: false,
        marketingCheck: false
      });

      // 로그인 페이지로 리다이렉트
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000); // 1초 후 이동 (사용자가 성공 메시지를 확인할 시간 제공)

    } catch (error) {
      console.error('회원가입 오류:', error);
      
      // Supabase 에러 메시지 처리
      let errorMessage = '회원가입 중 오류가 발생했습니다.';
      
      if (error.message.includes('already registered')) {
        errorMessage = '이미 가입된 이메일입니다.';
      } else if (error.message.includes('Password')) {
        errorMessage = '비밀번호 조건을 확인해주세요.';
      } else if (error.message.includes('Email')) {
        errorMessage = '유효한 이메일 주소를 입력해주세요.';
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 인증번호 발송 (UI만 구현)
  const handleVerificationSend = () => {
    if (validateField('phone', formData.phone)) {
      alert('인증번호가 발송되었습니다.');
      // 실제 SMS 발송 로직은 구현하지 않음
    }
  };

  // 인증번호 확인 (UI만 구현)
  const handleVerificationCheck = () => {
    if (validateField('verificationCode', formData.verificationCode)) {
      alert('인증이 완료되었습니다.');
      // 실제 인증 확인 로직은 구현하지 않음
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>
      <div className={styles.divider}></div>

      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <h2 className={styles.section_title}>1. 정보입력</h2>
          <p className={styles.section_description}>
            회원가입에 필요한 정보를 입력합니다.
          </p>

          <div className={styles.form_group}>
            <label className={styles.form_label}>
              이메일 <span className={styles.required}>*</span>
            </label>
            <input 
              type="email" 
              name="email"
              className={`${styles.form_input} ${errors.email ? 'error' : ''}`}
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={(e) => validateField('email', e.target.value)}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className={styles.form_group}>
            <label className={styles.form_label}>
              닉네임 <span className={styles.required}>*</span>
            </label>
            <input 
              type="text" 
              name="nickname"
              className={`${styles.form_input} ${errors.nickname ? 'error' : ''}`}
              placeholder="닉네임을 입력하세요"
              value={formData.nickname}
              onChange={handleInputChange}
              onBlur={(e) => validateField('nickname', e.target.value)}
            />
            {errors.nickname && <div className="error-message">{errors.nickname}</div>}
          </div>

          <div className={styles.form_group}>
            <label className={styles.form_label}>
              비밀번호 <span className={styles.required}>*</span>
            </label>
            <input 
              type="password" 
              name="password"
              className={`${styles.form_input} ${errors.password ? 'error' : ''}`}
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={(e) => validateField('password', e.target.value)}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className={styles.form_group}>
            <label className={styles.form_label}>
              비밀번호 확인 <span className={styles.required}>*</span>
            </label>
            <input 
              type="password" 
              name="passwordConfirm"
              className={`${styles.form_input} ${errors.passwordConfirm ? 'error' : ''}`}
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              onBlur={(e) => validateField('passwordConfirm', e.target.value)}
            />
            {errors.passwordConfirm && <div className="error-message">{errors.passwordConfirm}</div>}
          </div>

          <div className={styles.form_group}>
            <label className={styles.form_label}>
              휴대폰 번호 <span className={styles.required}>*</span>
            </label>
            <div className={styles.input_with_button}>
              <input 
                type="tel" 
                name="phone"
                className={`${styles.form_input} ${errors.phone ? 'error' : ''}`}
                placeholder="휴대폰 번호를 입력하세요"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={(e) => validateField('phone', e.target.value)}
              />
              <button
                type="button"
                className={`${styles.verification_btn} btn_normal`}
                onClick={handleVerificationSend}
              >
                인증번호 발송
              </button>
            </div>
            {errors.phone && <div className="error-message">{errors.phone}</div>}
          </div>

          <div className={styles.form_group}>
            <label className={styles.form_label}>
              인증번호 <span className={styles.required}>*</span>
            </label>
            <div className={styles.input_with_button}>
              <input 
                type="text" 
                name="verificationCode"
                className={`${styles.form_input} ${errors.verificationCode ? 'error' : ''}`}
                placeholder="인증번호를 입력하세요"
                value={formData.verificationCode}
                onChange={handleInputChange}
                onBlur={(e) => validateField('verificationCode', e.target.value)}
              />
              <button
                type="button"
                className={`${styles.verification_btn} btn_normal`}
                onClick={handleVerificationCheck}
              >
                확인
              </button>
            </div>
            {errors.verificationCode && <div className="error-message">{errors.verificationCode}</div>}
          </div>
        </div>

        <div className={`${styles.section} ${styles.terms_section}`}>
          <h2 className={styles.section_title}>2. 약관 동의</h2>
          <p className={styles.section_description}>
            회원가입에 필요한 약관을 동의해 주세요.
          </p>

          <div className={`${styles.terms_item} ${styles.all_agree}`}>
            <div className={styles.checkbox_container}>
              <input 
                type="checkbox" 
                className={styles.checkbox} 
                id="all_agree"
                checked={agreements.allAgree}
                onChange={(e) => handleAgreementChange('allAgree', e.target.checked)}
              />
              <label className={styles.checkbox_label} htmlFor="all_agree">
                전체 동의하기
              </label>
            </div>
          </div>

          <div className={styles.terms_detail}>
            <div className={styles.terms_detail_item}>
              <input 
                type="checkbox" 
                id="age-check" 
                className={styles.checkbox_input}
                checked={agreements.ageCheck}
                onChange={(e) => handleAgreementChange('ageCheck', e.target.checked)}
              />
              <label htmlFor="age-check" className={styles.checkbox_icon}>
                <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px">
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                </svg>
              </label>
              <span className={styles.required_term}>[필수]</span>
              <span>만 14세 이상입니다</span>
            </div>

            <div className={styles.terms_detail_item}>
              <input 
                type="checkbox" 
                id="terms-check" 
                className={styles.checkbox_input}
                checked={agreements.termsCheck}
                onChange={(e) => handleAgreementChange('termsCheck', e.target.checked)}
              />
              <label htmlFor="terms-check" className={styles.checkbox_icon}>
                <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px">
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                </svg>
              </label>
              <span className={styles.required_term}>[필수]</span>
              <span>이용약관 동의</span>
            </div>

            <div className={styles.terms_detail_item}>
              <input 
                type="checkbox" 
                id="privacy-check" 
                className={styles.checkbox_input}
                checked={agreements.privacyCheck}
                onChange={(e) => handleAgreementChange('privacyCheck', e.target.checked)}
              />
              <label htmlFor="privacy-check" className={styles.checkbox_icon}>
                <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px">
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                </svg>
              </label>
              <span className={styles.required_term}>[필수]</span>
              <span>개인 정보 수집 및 이용 동의</span>
            </div>

            <div className={styles.terms_detail_item}>
              <input 
                type="checkbox" 
                id="privacy-optional" 
                className={styles.checkbox_input}
                checked={agreements.privacyOptional}
                onChange={(e) => handleAgreementChange('privacyOptional', e.target.checked)}
              />
              <label htmlFor="privacy-optional" className={styles.checkbox_icon}>
                <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px">
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                </svg>
              </label>
              <span className={styles.optional_term}>[선택]</span>
              <span>개인 정보 수집 및 이용 동의</span>
            </div>

            <div className={styles.terms_detail_item}>
              <input 
                type="checkbox" 
                id="marketing-check" 
                className={styles.checkbox_input}
                checked={agreements.marketingCheck}
                onChange={(e) => handleAgreementChange('marketingCheck', e.target.checked)}
              />
              <label htmlFor="marketing-check" className={styles.checkbox_icon}>
                <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px">
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                </svg>
              </label>
              <span className={styles.optional_term}>[선택]</span>
              <span>광고성 정보 수신 모두 동의</span>
            </div>
          </div>
          
          {errors.terms && (
            <div className={`error-message ${styles.terms_error}`}>
              {errors.terms}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className={`${styles.signup_btn} btn_normal`}
          disabled={isSubmitting}
        >
          {isSubmitting ? '가입 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
}