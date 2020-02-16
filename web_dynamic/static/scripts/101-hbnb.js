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

  $('div.amenities input[type=checkbox]').change(function () {
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

  const states = {};

  $('div.locations input[type=checkbox].stChk').change(function () {
    if ($(this).is(':checked')) {
      states[$(this).data().id] = $(this).data().name;
    } else {
      delete states[$(this).data().id];
    }
    const listStates = [];
    for (const name in states) {
      listStates.push(states[name]);
    }
    $('DIV.locations H4').text(listStates.join(', '));
  });

  const cities = {};

  $('div.locations input[type=checkbox].ctChk').change(function () {
    if ($(this).is(':checked')) {
      cities[$(this).data().id] = $(this).data().name;
    } else {
      delete cities[$(this).data().id];
    }
    const listCities = [];
    for (const name in cities) {
      listCities.push(cities[name]);
    }
    $('DIV.locations H4').text(listCities.join(', '));
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
          `<article data-id="${elem.id}">
      
            <div class="title">
      
              <h2>${elem.name}</h2>
      
              <div class="price_by_night">
      
          $${elem.price_by_night}
      
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
            <div class="reviews">
                <h2>Reviews<span class="button-reviews">show</span></h2>
            
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
    const amenities = Object.keys(amens);
    const statesL = Object.keys(states);
    const citiesL = Object.keys(cities);
    const data = {};
    data.amenities = amenities;
    data.states = statesL;
    data.cities = citiesL;
    fetchPlaces(data);
  });

  $('body').on('click', '.button-reviews', function () {
    if ($(this).text() === 'show') {
      fetchReviews($(this), $(this).parent().parent(),
        $(this).parent().parent().parent().attr('data-id'));
      $(this).text('hide');
    } else {
      $(this).parent().siblings().remove();
      $(this).text('show');
    }
  });

  function fetchUserName (userId) {
    const urlUsers = 'http://0.0.0.0:5001/api/v1/users/' + userId;
    $.ajax({
      type: 'GET',
      url: urlUsers,
      success: function (data) {
        const fullName = data.first_name + ' ' + data.last_name;
        const userClass = '.' + userId;
        $(userClass).text(fullName);
      },
      error: function () {
        return '';
      }
    });
  }

  function fetchReviews (placeElement, parentElement, placeId) {
    const urlReviews = 'http://0.0.0.0:5001/api/v1/places/' + placeId + '/reviews';
    $.ajax({
      type: 'GET',
      url: urlReviews,
      success: function (data) {
        if ($.isEmptyObject(data)) {
          parentElement.append(
            '<p>No reviews yet</p>'
          );
        } else {
          for (const value of data) {
            const userFullName = fetchUserName(value.user_id);
            const createdAt = value.created_at.split(' ')[0];
            parentElement.append(
            `<p class="author-review">From <span class="${value.user_id}">${userFullName}</span> on ${createdAt}</p>
             <p>${value.text}</p>`
            );
          }
        }
      },
      error: function () {
        parentElement.append(
          '<p>There is an issue fetching the reviews for this place</p>'
        );
      }
    });
  }
});
