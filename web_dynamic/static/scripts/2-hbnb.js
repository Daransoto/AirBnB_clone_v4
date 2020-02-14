$(function () {
  const apiStatusBox = $('DIV#api_status');
  $.ajax({
    type: 'GET',
    url: 'http://0.0.0.0:5001/api/v1/status/',
    success: function (data) {
      if (data.status === 'OK') {
        apiStatusBox.addClass('available');
      } else {
        apiStatusBox.removeClass('available');
      }
    },
    error: function () {
      apiStatusBox.removeClass('available');
    }
  });

  const amens = {};

  $('input[type=checkbox]').change(function () {
    if ($(this).is(':checked')) {
      amens[$(this).data().id] = $(this).data().name;
    } else {
      delete amens[$(this).data().id];
    }
    const names = [];
    for (const name in amens) {
      names.push(amens[name]);
    }
    $('DIV.amenities H4').text(names.join(', '));
  });
});
