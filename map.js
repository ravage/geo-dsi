// função auto-executável, evita poluição do âmbito global.
// FIXME: refactor para componentes reutilizáveis
(function() {
	// google.maps.Map
	var map,
	// lista de marcadores
	markers = [],
	// abreviatura, simplifica a chamada da API
	gmaps = google.maps,
	// InfoWindow a ser utilizada nos marcadores
	info,
	// abreviar document.querySelectorAll para $
	$ = function(selector) { 
			return document.querySelectorAll(selector);
		}
	
	// função executada após carregamento HTML
	function initialize() {
		// objeto 'key-value-pair' com as opções iniciais para o mapa
		var mapOptions = {
				zoom: 16,
				mapTypeId: gmaps.MapTypeId.ROADMAP
			},
			// obter o elemento com o identificador 'map-canvas'
			element = $('#map-canvas').item(0),
			// inicialização da InfoWindow
			info = new gmaps.InfoWindow();
			// inicialização do mapa no elemento 'map-canvas'
			map = new gmaps.Map(element, mapOptions);
			// ligar ao evento click do mapa
			gmaps.event.addListener(map, 'click', function(event) {
				// ao receber um click, realizar geocodificação-inversa para obter uma morada
				reverseGeocode(event.latLng, function(results) {
					var marker;
					// caso sejam devolvidos resultados com moradas possíveis
					if (results.length > 0) {
						// criar marcador com posição e título obtido pela geocodificação
						marker = addMarker(event.latLng, { title: results[0].formatted_address });
						// adicionar o marcador ao elemento HTML (#links)
						createLink(marker, results[0].formatted_address);
					}	
				});
			});
			
			// ligar ao evento change do elemento '#links'
			$('#links').item(0).addEventListener('change', function(e) {
				// após o evento disparar, obter o respetivo marcador
				var marker = markers[e.target.value];

				// centrar o mapa no marcador/posição selecionada
				map.setCenter(marker.getPosition());
				// preencher e apresentar a InfoWindow com a morada completa
				info.setContent('<div><div><p>' + marker.getTitle() + '</p></div></div>');
				info.open(map, marker);
			}, false);

			// inicializar o formulário para geocodificação
			handleGeocodingForm();
			// inicializar geolocalização (navigator.geolocation)
			handleGeolocation();
	}

	// função para inicialização do navigator.geolocation
	function handleGeolocation() {
		// este marcador armazena a localização atual, uma vez criado
		// apenas se altera a sua posição
		var marker = null,
			// callback a ser executado caso a geolocalização seja bem sucedida
			successCallback = function(position) {
				// obter um objeto LatLng com a posição obtida da geolocalização
				var location = new gmaps.LatLng(position.coords.latitude, position.coords.longitude);

				// caso o marcador ainda não se tenha materializado
				if (marker == null) {
					// cria-se um novo
					marker = addMarker(location, { icon: 'gfx/person.png' });	
				}
				
				// após criação do marcador basta alterar a sua posição
				marker.setPosition(location);
				// centrar o mapa na localização obtida
				map.setCenter(location);
			},
			// callback a ser executado caso a geolocalização falhe
			errorCallback = function() {
				alert('Erro ao decifrar a localização!');
			};
		
		// ligar a API geolocation aos callbacks
		// watchPosition dispara novo evento caso haja alteração na posição
		navigator.geolocation.watchPosition(successCallback, errorCallback, { enableHighAccuracy: true });
	}

	// função para inicialização do formulário de geocodificação
	function handleGeocodingForm() {
		// obter o elemento que representa o form. pesquisa através de nome
		var form = $('[name=geocode]').item(0);
		
		// ligar ao evento submit
		form.addEventListener('submit', function(e) {
			// obter o valor da caixa de texto e executar a função de geocodificação
			geocode(e.target.address.value);
			// impedir que o processo de submit do form se realize
			e.preventDefault();
		}, false);
	}

	// função para adicionar um marcador no mapa
	// recebe uma posição e um objeto com opções { icon: '', title: '' }
	function addMarker(position, opts) {
		// opções definidas por omissão, 'merge' junta as predefinidas com as recebidas
		var options = merge({ icon: 'gfx/drop.png', title: '' }, opts),
			marker,
			// opções de inicialização para o marcador
			markerOptions = {
				map: map,
				position: position,
				icon: options.icon,
				title: options.title
			};
		
		// criar um novo marcador baseado na posição recebida
		marker = new gmaps.Marker(markerOptions);
		// criar uma propriedade index com a posição onde este marcador será adicionado
		marker.index = markers.length;
		// adicionar o marcador à lista de marcadores
		markers.push(marker);

		return marker;
	}

	// função para criar um 'link' associado a um marcador
	function createLink(marker, name) {
		// criar um elemento option para depois se adicionar ao elemento select
		var option = document.createElement('option'),
			// obter o elemento do HTML
			links = $('#links').item(0);
		
		// obter o nome associado ao marcador
		name = marker.getTitle();
		// criar um data attribute no elemento option com o nome como valor
		option.dataset.fullname = name;

		// limita-se o nome a 32 carateres para que não expanda o elemento
		// de forma exagerada
		if (name.length > 32) {
			name = name.substring(0, 32) + '...';	
		}

		// o elemento apresenta o nome do marcador
		option.textContent = name;
		// o elemento armazena no atributo value o índice do marcador
		// este índice é a associação com a lista de marcadores
		option.value = marker.index;

		// acrescentar a option ao elemento select
		links.appendChild(option);
	}

	// função para o processo de geocodificação
	// a partir de uma morada obter coordenadas
	function geocode(address) {
		// inicializar o geocoder
		// FIXME: basta inicializar uma vez
		var geocoder = new gmaps.Geocoder(),
			// nas opções define-se a morada a pesquisar
			geocoderOptions = {
				address: address
			};
		
		// executar a geocodificação
		geocoder.geocode(geocoderOptions, function(results, status) {
			var location; 
			// caso a geocodificação seja bem sucedida
			if (status === gmaps.GeocoderStatus.OK) {
				// obter as coordenadas
				location = results[0].geometry.location;
				// centrar o mapa de acordo com as coordenadas obtidas
				map.setCenter(location);
			} else {
				// para o caso de surgir um erro no processo
				alert('Não Encontrado!');
			}
		});
	}

	// função para o processo de geocodificação inversa
	// obter morada a partir de coordenadas
	function reverseGeocode(position, callback) {
		// inicializar o geocoder
		// FIXME: basta inicializar uma vez
		var geocoder = new gmaps.Geocoder(),
			// nas opções define-se as coordenadas a pesquisar
			geocoderOptions = {
				location: position
			};

		// executar a geocodificação inversa
		geocoder.geocode(geocoderOptions, function(results, status) {
			// caso o processo conclua com sucesso
			if (status = gmaps.GeocoderStatus.OK) {
				// verificar se foi efetivamente passado um callback
				if (callback !== undefined) {
					// executar o callback passando os resultados obtidos na geocodificação
					callback(results);
				}
			}
		});
	}

	// função utilitária para fundir as opções omissas com as recebidas
	// FIXME: multi-nível com validação de objetos
	function merge(defaults, incoming) {
		// iterar por todas a propriedades recebidas
		for (var option in incoming) {
			// substituir as omissas pelas recebidas
			defaults[option] = incoming[option];
		}

		return defaults;
	}

	// ligar ao evento DOMContentLoaded, só após a sua ativação se arranca com todo o processo
	window.addEventListener('DOMContentLoaded', initialize, false);
}).call(this);