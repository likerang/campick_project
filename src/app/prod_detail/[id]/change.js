'use client';
import { useState } from "react";
import { createClient } from '../../../utils/supabase/client';

export default function Change({ option }) {
  const supabase = createClient();
  const [product, setProduct] = useState(option);
  console.log(product.prod_id);

  const handle = async (evt) => {
    const newStatus = evt.target.value;
    console.log(newStatus);

    const { data, error } = await supabase
      .from("Product")
      .update({ prod_status: newStatus })
      .eq("prod_id", product.prod_id)
      .select()
    if (error) {
      console.error("업데이트 실패:", error.message);
      return;
    }
    // 상태 업데이트 (중요!)
    setProduct((prev) => ({
      ...prev,
      prod_status: newStatus
    }));
    console.log("업데이트 성공:", data);
    console.log("업데이트 성공:", product);

  };

  return (
    <>
      <select
        value={product.prod_status}
        onChange={handle}
      >
        <option value={"1"}>판매중</option>
        <option value={"0"}>판매완료</option>
      </select>
    </>
  );
}