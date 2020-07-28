<!DOCTYPE html>

<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=11">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" href="./point_in_polygon.css">

	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   		integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   		crossorigin=""/>
	<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" 
   		integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
   		crossorigin=""></script>
   <script src="https://unpkg.com/esri-leaflet@2.3.3/dist/esri-leaflet.js"
    	integrity="sha512-cMQ5e58BDuu1pr9BQ/eGRn6HaR6Olh0ofcHFWe5XesdCITVuSBiBZZbhCijBe5ya238f/zMMRYIMIIg1jxv4sQ=="
		crossorigin=""></script>
		
	<!-- Esri Leaflet Geocoder -->
	<link rel="stylesheet" href="https://unpkg.com/esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css">
	
    <script src="https://unpkg.com/esri-leaflet-geocoder"></script>
	
</head>
<body>


<header>

<h1>POINT IN POLYGON</h1>
<p>This page implements the point in polygon Winding number algorithm taken from <a href = "http://geomalgorithms.com/a03-_inclusion.html">www.geomalgorithms.com</a></p>

</header>

	<div id="mapid">
		<button id="get_pos"> &#8982;</button>
	</div>	

<div class = 'buttons2'>
	<button id ="put_point">GET POINT</button> 	
	<button id="close_path">CLOSE PATH</button> 
	<button id="test_point">TEST</button> 

</div>

<br>

<footer>
</footer>

<script src="point_in_polygon.js" defer></script>


</body>
</html>

