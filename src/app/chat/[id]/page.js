/*
 * 파일명: page.js (chat.html)
 * 담당자: 김영태
 * 작성일: 2025-09-04
 * 최근 수정일: 2025-09-04
 * 설명: chat.html의 next.js 버전
 * 수정이력:
 *  2025-09-04: chat.html의 코드 next.js 문법으로 변경
*/
"use client"

import React, { useState, useEffect, useRef } from "react";
import { createClient } from '../../../utils/supabase/client';
import Image from "next/image"
import Link from "next/link"
import styles from "./page.module.css"



// export const metadata = {
//   title: "Campick - 상대방ID",
//   description: "Welcome to Campick",
// };

export default function Chat({ params }) {
  const supabase = createClient();
  // URL params가 있으면 사용하고, 없으면 임시값(chat_id=3) 사용
  // const chatRoomId = params?.chatId ? Number(params.chatId) : 3;
  const chatRoomId = 3;
  // 현재 로그인된 사용자 (문제에서 seller(user_id=4)로 가정)
  const currentUserId = 4;

  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  // 컴포넌트 마운트 또는 chatRoomId 변경 시 채팅방 정보&메시지 로드
  useEffect(() => {  // 채팅방 정보 로드 (ChatRoom 테이블에서 chat_id로 단일 조회)
    const loadChatRoom = async () => {
      try {
        const { data, error } = await supabase
          .from('ChatRoom')
          .select('*')
          .eq('chat_id', chatRoomId)
          .single();

        if (error) throw error;
        setChatRoom(data);
      } catch (err) {
        console.error('채팅방 로드 에러:', err);
        setChatRoom(null);
      }
    };

    // 메시지 불러오기 (ChatMessage 테이블에서 chat_id 기준)
    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('ChatMessage')
          .select('message_id, chat_id, sender_id, content, created_at, is_read')
          .eq('chat_id', chatRoomId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error('메시지 로드 에러:', err);
      }
    };

    loadChatRoom();
    loadMessages();
    // eslint-disable-next-line
  }, [chatRoomId]);




  // 메시지 전송 (insert 후 반환된 행을 상태에 추가)
  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text || isSending) return;

    setIsSending(true);
    try {
      // created_at은 DB default(now())로 처리되어 있다고 가정
      const { data, error } = await supabase
        .from('ChatMessage')
        .insert({
          chat_id: chatRoomId,
          sender_id: currentUserId,
          content: text,
          is_read: false
        })
        // 삽입된 행을 받기 위해 select 후 single 호출
        .select('message_id, chat_id, sender_id, content, created_at, is_read')
        .single();


      if (error) throw error;


      // 서버에서 받은 실제 행을 messages에 추가
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (err) {
      console.error('메시지 전송 에러:', err);
      // 필요하면 사용자에게 에러 알림(토스트 등) 처리
    } finally {
      setIsSending(false);
    }
  };
  // Enter(단, IME 조합 중은 무시) -> 메시지 전송
  const handleKeyDown = (evt) => {
    if (evt.nativeEvent && evt.nativeEvent.isComposing) return; // IME 입력 중
    if (evt.key === 'Enter' && !evt.shiftKey) {
      evt.preventDefault();
      sendMessage();
    }
  };
  // 시간 포맷팅 (예: "오후 4시 05분")
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const fmt = new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date); // ex: "오후 4:05"
    const [period, time] = fmt.split(' ');
    const [hour, minute] = time.split(':');
    return `${period} ${hour}시 ${minute}분`;
  };


  console.log(params)
  return (
    <>
      <div className={styles.chat_content}>
        {/* chat_header  */}
        <div className={styles.chat_header}>
          <div className={styles.chat_header_top}>
            <h3 className={`small_tb ${styles.chat_title}`}>user_id</h3>
            <button className={styles.prev}>
              <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 -960 960 960"
                width="12.1758H4" fill="#666666">
                <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
              </svg>
            </button>
          </div>
          <div className={styles.chat_product_info}>
            <a className={styles.chat_thumbnail}>
              <Image
                src="/images/product_img01.jpg"
                width={60}
                height={60}
                alt=""
              />
            </a>
            <div className={styles.chat_meta}>
              <h4 className={`xsmall_tr ${styles.chat_product_title}`}>[힐레베르그] 알락 2 텐트 (Allak 2)</h4>
              <p className={`small_tb ${styles.chat_product_price}`}>1,893,000원</p>
            </div >
            <div className={styles.chat_button_group} >
              <button className={styles.wishlist} > 찜</button >
              <button className={styles.buy} > 구매하기</button >
            </div >
          </div >
          <div className={styles.chat_banner} >
            <a href="">
              안전결제 관련 안내
              <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 -960 960 960" width="12px"
                fill="#fff">
                <path d="m288-96-68-68 316-316-316-316 68-68 384 384L288-96Z" />
              </svg>
            </a>
          </div >
        </div >
        {/* //chat_header  */}

        {/* chat_body */}
        <div className={styles.chat_body}>
          <div className={`xsmall_tr ${styles.chat_date}`}>대화 내용</div>

          {messages.map((msg) => (
            <div
              key={msg.message_id ?? msg.id}
              className={`${styles.message} ${msg.sender_id === currentUserId ? styles.buyer : styles.seller}`}>
              <div className={`small_tr ${styles.message_bubble}`}>{msg.content}</div>
              <div className={styles.message_time}>{formatTime(msg.created_at)}</div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
        {/* //chat_body */}
      </div >

      {/* input_message  */}
      <div className={styles.chat_input} >
        <button className={styles.add_btn} >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
            fill="#000000">
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
          </svg>
        </button >

        <input
          className={styles.input_field}
          type="text"
          placeholder="메시지를 입력하세요..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
        />
        <button className={styles.send_btn}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
            fill="#000000">
            <path
              d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
          </svg>
        </button >
      </div >
      {/* //input_message  */}

    </>
  )
}