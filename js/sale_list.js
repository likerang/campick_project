const tabs = document.querySelectorAll('.tab_menu a');
const lists = document.querySelectorAll('[data-list]');
const moreBtns = document.querySelectorAll('.more_btn');
const bottomSheet = document.querySelector('.bottom_sheet');

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
        list.classList.remove('hidden'); // 보여주기
      } else {
        list.classList.add('hidden'); // 숨기기
      }
    });
  });
});

// 더보기 btn
moreBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    bottomSheet.classList.toggle('active');
  });
});

window.addEventListener('click', (e) => {
  if (!e.target.closest('.more_btn') && !e.target.closest('.bottom_sheet')) {
    bottomSheet.classList.remove('active');
  }
});
