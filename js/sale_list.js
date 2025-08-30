$(function() {
  $('.tab_menu a').click(function(e) {
    e.preventDefault();

    // 클릭된 탭 active 처리
    $('.tab_menu a').removeClass('active');
    $(this).addClass('active');

    // 어떤 필터인지 확인
    const filter = $(this).data('filter');

    // 목록 토글
    if(filter === 'selling'){
      $('.product_list_wrapper_2col').removeClass('hidden');
      $('.soldout_list_wrapper').addClass('hidden');
    } else if(filter === 'soldout'){
      $('.soldout_list_wrapper').removeClass('hidden');
      $('.product_list_wrapper_2col').addClass('hidden');
    }
  });
});