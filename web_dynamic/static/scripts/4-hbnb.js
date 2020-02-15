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

  function fetchPlaces (data) {
    $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    success: function (data) {
      const sorted = data.sort(function (a, b) { return a.name.localeCompare(b.name); });
      for (const elem of sorted) {
        $('section.places').append(
          `<article>
      
            <div class="title">
      
              <h2>${elem.name}</h2>
      
              <div class="price_by_night">
      
          ${elem.price_by_night}
      
              </div>
            </div>
            <div class="information">
              <div class="max_guest">
          <i class="fa fa-users fa-3x" aria-hidden="true"></i>
      
          <br />
      
          ${elem.max_guest} Guests
      
              </div>
              <div class="number_rooms">
          <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
      
          <br />
      
          ${elem.number_rooms} Bedrooms
              </div>
              <div class="number_bathrooms">
          <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
      
          <br />
      
          ${elem.number_bathrooms} Bathroom
      
              </div>
            </div>
      
            <!-- **********************
           USER
           **********************  -->
      
            <div class="user">
      
              <!-- <strong>Owner: {{ users[place.user_id] }}</strong> -->
      
            </div>
            <div class="description">
      
              ${elem.description}
      
            </div>
      
          </article> <!-- End 1 PLACE Article -->`
        );
      }
    }
  });
  }

  fetchPlaces({});

  $('BUTTON').click(function () {
    $('section.places').empty();
    const keys = Object.keys(amens);
    const data = {}
    data["amenities"] = keys;
    fetchPlaces(data);
  });

});
