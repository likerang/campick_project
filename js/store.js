const brandBtn = document.querySelector('.brand_filter button');
const brandPopup = document.querySelector('.brand_popup');
const overlay = document.querySelector('.overlay');
const checkboxes = brandPopup.querySelectorAll('input[type="checkbox"]');
const searchInput = document.querySelector('.brand_search input');
const brandList = document.querySelector('.brand_list');
const brands = Array.from(brandList.querySelectorAll('li')).filter(li => !li.classList.contains('no_result'));
const noResultList = brandList.querySelector('.no_result');
const applyBtn = brandPopup.querySelector('.apply_btn');
const brandSelected = document.querySelector('.brand_selected');

/* 브랜드 버튼 클릭 */
brandBtn.addEventListener('click', () => {
  brandPopup.classList.toggle('active');
  overlay.classList.toggle('active');
});

/* 팝업 닫기 + 초기화 */
function closeBrandPopup() {
  brandPopup.classList.remove('active');
  overlay.classList.remove('active');

  checkboxes.forEach(cb => cb.checked = false);
  searchInput.value = '';
  brands.forEach(li => li.style.display = '');
  noResultList.style.display = 'none';
}

/* 팝업 외부 클릭 시 닫기 */
window.addEventListener('click', (e) => {
  if (!e.target.closest('.brand_filter button') && !e.target.closest('.brand_popup')) {
    closeBrandPopup();
  }
});

/* 실시간 검색 */
searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.toLowerCase().trim();

  if (!keyword) {
    brands.forEach(li => li.style.display = '');
    noResultList.style.display = 'none';
    return;
  }

  let hasResult = false;

  brands.forEach(li => {
    const title = li.querySelector('.brand_title').textContent.toLowerCase();
    if (title.includes(keyword)) {
      li.style.display = '';
      hasResult = true;
    } else {
      li.style.display = 'none';
    }
  });

  noResultList.style.display = hasResult ? 'none' : 'block';
});

/* 적용 버튼 클릭 */
applyBtn.addEventListener('click', () => {
  // 선택된 브랜드 가져오기
  const selectedBrands = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  // 화면에 표시
  brandSelected.innerHTML = ''; // 기존 삭제
  if (selectedBrands.length > 0) {
    selectedBrands.forEach(name => {
      const span = document.createElement('span');
      span.className = 'brand_badge';
      span.textContent = name;
      brandSelected.appendChild(span);
    });
  }

  // 팝업 닫고 초기화
  closeBrandPopup();
});
