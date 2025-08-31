$(function(){
  const brandLabel = document.querySelector(".brand_label");
  const brandPopup = document.querySelector(".brand_popup");
  const applyBtn = document.querySelector(".apply_btn");
  const brandSelected = document.querySelector(".brand_selected");
  const brandSearch = document.querySelector("#brandSearch");
  const checkboxes = document.querySelectorAll(".brand_list input[type='checkbox']");

  // 브랜드 버튼 클릭 → 팝업 열고 닫기
  brandLabel.addEventListener("click", () => {
    brandPopup.classList.toggle("active");
  });

  // "적용하기" 버튼 → 선택된 브랜드 반영
  applyBtn.addEventListener("click", () => {
    const checkedBrands = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    brandSelected.innerHTML = ""; // 기존 뱃지 초기화

    if (checkedBrands.length === 1) {
      brandSelected.innerHTML = `<span class="brand_badge">${checkedBrands[0]}</span>`;
    } else if (checkedBrands.length > 1) {
      brandSelected.innerHTML = `<span class="brand_badge">${checkedBrands[0]} 외 ${checkedBrands.length - 1}</span>`;
    }

    brandPopup.classList.remove("active"); // 팝업 닫기
  });

  // 브랜드 검색 필터링
  brandSearch.addEventListener("input", () => {
    const keyword = brandSearch.value.toLowerCase();
    checkboxes.forEach(cb => {
      const label = cb.parentElement.textContent.toLowerCase();
      cb.parentElement.parentElement.style.display =
        label.includes(keyword) ? "block" : "none";
    });
  });

  // 팝업 외부 클릭 시 닫기
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".brand_filter")) {
      brandPopup.classList.remove("active");
    }
  });
});