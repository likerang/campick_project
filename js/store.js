/* 요소 선택 */
const categoryLinks = document.querySelectorAll('.store_category .category_menu a.category');
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
const brandTitle = document.querySelector('.brand_filter h3');

/* 카테고리 제목 변경 */
categoryLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    categoryLinks.forEach(l => l.classList.remove('selected'));
    this.classList.add('selected');

    brandTitle.textContent = this.textContent;

    brandSelected.innerHTML = '';
    checkboxes.forEach(cb => cb.checked = false);
  });
});

/* 브랜드 선택 팝업 */
brandBtn.addEventListener('click', () => {
  brandPopup.classList.toggle('active');
  overlay.classList.toggle('active');
});

/* 팝업 닫기 */
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

/*  실시간 검색 */
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

/* 선택된 브랜드 화면 적용 */
applyBtn.addEventListener('click', () => {
  const selectedBrands = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  brandSelected.innerHTML = ''; // 기존 뱃지 제거

  selectedBrands.forEach(name => {
    const span = document.createElement('span');
    span.className = 'brand_badge';

    // 삭제 버튼 + SVG 이미지
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove';
    const img = document.createElement('img');
    img.src = 'images/store_close_primary.svg';
    img.alt = '삭제';
    removeBtn.appendChild(img);

    // 삭제 버튼 클릭 시
    removeBtn.addEventListener('click', () => {
      span.remove();
      checkboxes.forEach(cb => {
        if (cb.value === name) cb.checked = false;
      });
    });

    span.textContent = name + " "; // 브랜드 이름
    span.appendChild(removeBtn);
    brandSelected.appendChild(span);
  });

  closeBrandPopup();
});
