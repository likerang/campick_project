'use client';

import { useState } from "react";


export default function Change(option) {
    // console.log(option);
    const [product, setProduct] = useState({...option})
    console.log(product);
    const handle = () => {
        setProduct((prev) => ({
            ...prev,
            prod_status: 0
        }));
        // console.log(product);
    }
    return (
        // <div>판매중</div>
        <button onClick={handle}>판매중지</button>
    );
}