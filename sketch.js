var data;
var name;
var mymap;
var marker;
var guessLatLng;
var street;
var errorline;
var drawnStreet;
var wien = new L.LatLng(48.2110, 16.3725);

function preload() {
    // var url = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:STRASSENGRAPHOGD&srsName=EPSG:4326&outputFormat=json"
    // data = loadJSON(url)
    data = loadJSON("streets.json")
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    background(100);

    var layers = ["toner", "toner-lines", "terrain","terrain-lines", "watercolor"];
    var layer = "toner-lines"
    mymap = new L.Map(layer, {
        center: wien,
        zoom: 12,
        minZoom: 12,
        maxZoom: 16,
        zoomControl: false
    });
    var linelayer = new L.StamenTileLayer(layer, {
        detectRetina: true
    });
    mymap.addLayer(linelayer);
    var labellayer = new L.StamenTileLayer("toner-labels",{
        detectRetina: true
    });

    mymap.setMaxBounds(mymap.getBounds());
    mymap.setZoom(13);
    // mymap.overlay(canvas)
    var center = mymap.getCenter();
    marker = new L.marker(center).addTo(mymap);
    
	// control that shows state info on hover
	var info = L.control({position: "topleft"});

	info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        street = getRandomStreet();
		this.update();
		return this._div;
	};
    // As used in example
	// info.update = function (props) {
	// 	this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
	// 		'<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
	// 		: 'Hover over a state');
    // };
    info.update = function () {
        this._div.innerHTML = 'Find: </br>'+street
    }
    info.addTo(mymap);

    L.control.custom({
        position: 'bottomright',
        content : '<button name="guess" type="button" class="btn btn-success btn-lg">'+
                '<i class="glyphicon glyphicon-ok"></i>'+
                '</button>',
        classes : 'btn-group-horizontal btn-group-lg',
        style   :
        {
            margin: '10px',
            padding: '0px 0 0 0',
            cursor: 'pointer'
        },
        datas   :
        {
            'foo': 'bar',
        },
        events:
        {
            click: function(data)
            {
                var guess = marker._latlng;
                console.log('ok clicked');
                mymap.addLayer(labellayer);
                drawStreet(street);
                mymap.fitBounds(drawnStreet.getBounds());
                var really = marker._latlng;
                errorline = L.polyline([guess, really]).addTo(mymap);
                var errordist = mymap.distance(guess, really);
                console.log(errordist);
            },
        }})
        .addTo(mymap);

        L.control.custom({
            position: 'bottomleft',
            content : '<button name="new" type="button" class="btn btn-warning btn-lg">'+
                    '<i class="glyphicon glyphicon-refresh"></i>'+
                    '</button>',
            classes : 'btn-group-horizontal btn-group-lg',
            style   :
            {
                margin: '30px',
                padding: '0px 0 0 0',
                cursor: 'pointer'
            },
            datas   :
            {
                'foo': 'bar',
            },
            events:
            {
                click: function(data)
                {
                    console.log('refresh clicked');
                    mymap.setView(wien, 13);
                    street = getRandomStreet();
                    info.update();
                    mymap.removeLayer(labellayer);
                    drawnStreet.remove();
                    errorline.remove();
                    console.log(street)
                },
            }})
            .addTo(mymap);
}
function drawStreet(name) {
    drawnStreet = L.geoJSON(data, {filter: function(feature) {return feature.properties.FEATURENAME == name}}).addTo(mymap);
    drawnStreet.addData(marker.toGeoJSON());
}

function getRandomStreet() {
    var temp = data.features[floor(random(28484))].properties.FEATURENAME
    if (temp != "Unbenannte Verkehrsfläche") {
        return temp
    } else {
        return getRandomStreet()
    }
}
function drawMarker() {
    center = mymap.getCenter();
    marker.setLatLng(center);
}

function draw() {
    drawMarker();
}
