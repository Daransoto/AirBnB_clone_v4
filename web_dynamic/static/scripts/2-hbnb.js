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
});
