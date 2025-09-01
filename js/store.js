$(function(){
  const brandButton = document.querySelector('.brand_filter button');
  const brandPopup = document.querySelector('.brand_popup');

  brandButton.addEventListener('click', () => {
    brandPopup.classList.toggle('active');
  });

  // 팝업 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!brandPopup.contains(e.target) && !brandButton.contains(e.target)) {
      brandPopup.classList.remove('active');
    }
  });
});