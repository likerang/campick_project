const tabs = document.querySelectorAll('.tab_menu a');
const lists = document.querySelectorAll('[data-list]');
const moreBtns = document.querySelectorAll('.more_btn');
const bottomSheet = document.querySelector('.more_popup');
const overlay = document.querySelector('.overlay');

// 판매중/결제완료 list tab
tabs.forEach(tab => {
  tab.addEventListener('click', function(e) {
    e.preventDefault();

    // 탭 active 변경
    tabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    const filter = this.dataset.filter;

    lists.forEach(list => {
      if (list.dataset.list === filter) {
        list.classList.remove('hidden');
      } else {
        list.classList.add('hidden');
      }
    });
  });
});

// 더보기 btn
moreBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    bottomSheet.classList.toggle('active');
    overlay.classList.toggle('active');
  });
});

// 팝업 외부 클릭 시 닫기
window.addEventListener('click', (e) => {
  if (!e.target.closest('.more_btn') && !e.target.closest('.more_popup')) {
    bottomSheet.classList.remove('active');
    overlay.classList.remove('active');
  }
});