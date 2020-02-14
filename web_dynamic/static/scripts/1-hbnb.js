document.addEventListener('DOMContentLoaded', function () {
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
