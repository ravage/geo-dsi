(function() {
	var map,
	markers = [],
	gmaps = google.maps,
	info,
	$ = function(selector) { 
			return document.querySelectorAll(selector);
		}
	
	function initialize() {
		var mapOptions = {
				zoom: 16,
				mapTypeId: gmaps.MapTypeId.ROADMAP
			},
			element = document.getElementById("map-canvas"),
			info = new gmaps.InfoWindow();
			
			map = new gmaps.Map(element, mapOptions);
			
			gmaps.event.addListener(map, 'click', function(event) {
				reverseGeocode(event.latLng, function(results) {
					var marker;
					if (results.length > 0) {
						marker = addMarker(event.latLng, { title: results[0].formatted_address });
						createLink(marker, results[0].formatted_address);
					}	
				});
			});
			
			$('#links').item(0).addEventListener('change', function(e) {
				var marker = markers[e.target.value],
					option = e.target.children[e.target.selectedIndex];

				map.setCenter(marker.getPosition());
				
				info.setContent('<div><div><p>' + option.dataset.fullname + '</p></div></div>');
				info.open(map, marker);
			}, false);

			handleGeocodingForm();
			geolocation();
	}

	function geolocation() {
		var marker = null,
			successCallback = function(position) {
				var location = new gmaps.LatLng(position.coords.latitude, position.coords.longitude);

				if (marker == null) {
					marker = addMarker(location, { icon: 'gfx/person.png' });	
				}
				
				marker.setPosition(location);
				map.setCenter(location);
			},
			errorCallback = function() {
				alert('Erro ao decifrar a localização!');
			};
			
		navigator.geolocation.watchPosition(successCallback, errorCallback, { enableHighAccuracy: true });
	}

	function handleGeocodingForm() {
		var form;
		
		form = $('[name=geocode]').item(0);
		
		form.addEventListener('submit', function(e) {
			geocode(e.target.address.value);
			e.preventDefault();
		}, false);
	}

	function addMarker(latLng, opts) {
		var options = merge({ icon: 'gfx/drop.png', title: '' }, opts),
			markerOptions = {
				map: map,
				position: latLng,
				icon: options.icon,
				title: options.title
			};
		
		marker = new gmaps.Marker(markerOptions);
		marker.index = markers.length;
		markers.push(marker);
		return marker;
	}

	function createLink(marker, name) {
		var option = document.createElement('option'),
			links = $('#links').item(0);
		
		name = name || 'N/A';
		option.dataset.fullname = name;

		if (name.length > 32) {
			name = name.substring(0, 32) + '...';	
		}

		option.textContent = name;
		option.value = marker.index;

		
		links.appendChild(option);
	}

	function geocode(address) {
		var geocoder = new gmaps.Geocoder(),
			geocoderOptions = {
				address: address
			};
		
		geocoder.geocode(geocoderOptions, function(results, status) {
			var location; 
			if (status === gmaps.GeocoderStatus.OK) {
				location = results[0].geometry.location;
				map.setCenter(location);
			} else {
				alert('Não Encontrado!');
			}
		});
	}

	function reverseGeocode(position, callback) {
		var geocoder = new gmaps.Geocoder(),
			geocoderOptions = {
				location: position
			};

		geocoder.geocode(geocoderOptions, function(results, status) {
			if (status = gmaps.GeocoderStatus.OK) {
				if (callback !== undefined) {
					callback(results);
				}
			}
		});
	}

	function merge(defaults, incoming) {
		for (var option in incoming) {
			defaults[option] = incoming[option];
		}

		return defaults;
	}

	window.addEventListener('DOMContentLoaded', initialize, false);
}).call(this);