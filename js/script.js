function titleCap(str) {
  var newStr = '';
  str = str.split(' ');
  for (var i = 0; i < str.length; i++) {
    var word = str[i].toLowerCase();
    var firstLetter = word[0];
    firstLetter = firstLetter.toUpperCase();
    var restOfWord = word.substring(1, word.length);
    if (i == str.length - 1) {
      word = firstLetter + restOfWord;
      word = word.toUpperCase();
    } else {
      word = firstLetter + restOfWord + ' ';
    }
    newStr += word;
  }
  return newStr;
}

function loadData() {

  var $body = $('body');
  var $wikiElem = $('#wikipedia-links');
  var $nytHeaderElem = $('#nytimes-header');
  var $nytElem = $('#nytimes-articles');
  var $greeting = $('#greeting');
  var $placeholder = $('.placeholder')

  var $street = $('#street');
  var $city = $('#city');

  // Removes old data and placeholders
  $wikiElem.text('');
  $nytElem.text('');
  $placeholder.text('');

  // Load Street View
  var street = $street.val();
  var city = $city.val();
  var address = addressComma(street, city);

  // Adds a comma if a street is provided
  function addressComma(st, cty) {
    if (st) {
      return st+ ' ' + cty;
    } else {
      return cty;
    }
  }

  $greeting.text('Address: ' + titleCap(address));
  $body.append('<img class="bgimg" src="https://maps.googleapis.com/maps/api/streetview?size=640x640&location=' + address + '&key=AIzaSyAo2ON0fKXGRultiPxp79Yv_WyWmLrKvIY" >');

  // NYTimes AJAX Request
  var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
  url += '?' + $.param({
    'api-key': "090a897e531a445196ec589613ac001f",
    'q': city,
    'page': 0
  });

  $.ajax({
    url: url,
    method: 'GET',
  }).done(function(data) {
    for (var i = 0; i < data.response.docs.length; i++) {
      var articleHeading = data.response.docs[i].headline.main;
      var articleURL = data.response.docs[i].web_url;
      $nytElem.append('<li class="article"> <a href="' + articleURL + '" target="_blank">' + articleHeading + '</a></li>');
    }
  }).fail(function() {
    $nytElem.append('Uh oh. There was a problem retrieving your news articles. Please try again later.');
  });


  //Wikipedia AJAX Request
  var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + city + "&format=json&callback=wikiCallback";
  var wikiRequestTimeout = setTimeout(function() {
    $wikiElem.text('Wuh oh. There was a problem retrieving your Wikipedia links. Please try again later.')
  }, 8000);

  $.ajax({
    url: wikiURL,
    dataType: 'jsonp',
    type: 'POST',
    success: function(data) {
      for (var i = 0; i < data[1].length; i++) {
        var articleHeading = data[1][i];
        var articleURL = data[3][i];
        $wikiElem.append('<li> <a href="' + articleURL + '" target="_blank">' + articleHeading + '</a></li>');
      }
      clearTimeout(wikiRequestTimeout);
    }
  });

  return false;
};

$('#form-container').submit(loadData);
