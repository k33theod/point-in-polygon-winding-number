//map code
// let ps = JSON.parse(g_points);
let marker =null;
let points = [];
let mymap = null;
let polygon = null;
let mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>, <a href="http://placequality.com">Place Quality</a>',
  maxZoom: 20,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiazMzdGhlb2QiLCJhIjoiY2s4aHQ5NXZqMDNpaDNmbWNrZ2gxd3ppaCJ9.E7HfD0vWCgCQYwZCvvc5SQ'
});

let osm = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>, <a href="http://placequality.com">Place Quality</a>',
  maxZoom: 20,
  id: 'mapbox/satellite-streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiazMzdGhlb2QiLCJhIjoiY2s4aHQ5NXZqMDNpaDNmbWNrZ2gxd3ppaCJ9.E7HfD0vWCgCQYwZCvvc5SQ'
});

var baseLayers = {
  "Street": mapbox,
  "Satelite": osm
};

let grenze ={'nwx':48.2496575, 'nwy':16.319847201852802, 'sex':48.19198386848204, 'sey':16.469165000212342};

function load_map ()
{
  mymap = L.map('mapid').setView([(grenze['nwx']+grenze['sex'])/2, (grenze['nwy']+grenze['sey'])/2], 13);
  mymap.scrollWheelZoom.disable();
  mymap.on('focus', () => { mymap.scrollWheelZoom.enable(); });
  mymap.on('blur', () => { mymap.scrollWheelZoom.disable(); });
  // let zoom = mymap._animateToZoom;
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>, Theodoros',
      maxZoom: 20,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiazMzdGhlb2QiLCJhIjoiY2s4aHQ5NXZqMDNpaDNmbWNrZ2gxd3ppaCJ9.E7HfD0vWCgCQYwZCvvc5SQ'
  }).addTo(mymap);
  L.control.layers(baseLayers).addTo(mymap);
  let searchControl = L.esri.Geocoding.geosearch().addTo(mymap);
  // create an empty layer group to store the results and add it to the map
  let results = L.layerGroup().addTo(mymap);

  searchControl.on("results", function(data) {
      results.clearLayers();
      for (var i = data.results.length - 1; i >= 0; i--) 
      {
        if (marker) 
        {
          // marker.remove();
          if (markers.indexOf(marker)==-1)
          {
            mymap.removeLayer(marker);
          }
        }
        marker =  new L.Marker(data.results[i].latlng).addTo(mymap);

        lat =  data.results[i].latlng.lat;
        lon = data.results[i].latlng.lng;
        
        if (zoom<14)
          mymap.setView([lat, lon], 14);
        else
          mymap.setView([lat, lon], zoom);
      }
  });

  mymap.on('click', onMapClick);
  function onMapClick(e) {
    if (marker) 
      marker.remove();
    marker = new L.Marker(e.latlng, {draggable:true,}).addTo(mymap);
    marker.bindPopup(marker.getLatLng().toString()).openPopup();
    marker.on('move', onmove_function);
    // console.log(point_in_poligon(marker,ps));
  }
}
load_map();

function onmove_function(e)
{
  marker.bindPopup(marker.getLatLng().toString()).openPopup();
}

let g_p_b = document.getElementById('put_point');
g_p_b.addEventListener('click', get_point_function);

function get_point_function(e)
{
  let point = marker.getLatLng();
  points.push(point);
  L.circle(point, {radius:3,color:'red',}).addTo(mymap);
  if (polygon)
    polygon.addLatLng(point);
  else
    polygon = L.polyline(points,{color:'green', weight:2,}).addTo(mymap);
}

function point_in_poligon(p,V)
{
  let  wn = 0;    // the  winding number counter
  let n = V.length;
  let plat = p.getLatLng().lat;

  // loop through all edges of the polygon
  for (let i=0; i<n-1; i++) {   // edge from V[i] to  V[i+1]
      if (V[i].lat <= plat) {          // start y <= P.y
          if (V[i+1].lat  > plat)      // an upward crossing
                if (isLeft( V[i], V[i+1], p) > 0)  // P left of  edge
                    ++wn;            // have  a valid up intersect
      }
      else {                        // start y > P.y (no test needed)
          if (V[i+1].lat  <= plat)     // a downward crossing
                if (isLeft( V[i], V[i+1], p) < 0)  // P right of  edge
                    --wn;            // have  a valid down intersect
      }
  }
  return wn;
}

function isLeft( P0, P1, P2 )
{
  let plat = P2.getLatLng().lat;
  let plng = P2.getLatLng().lng;
  return ( (P1.lng - P0.lng) * (plat - P0.lat)
            - (plng -  P0.lng) * (P1.lat - P0.lat) );
}

document.getElementById('close_path').addEventListener('click', close_path)
function close_path(e)
{
  if(points.length<3)
  {
    alert ("you need at least 3 points");
    return;
  }
  points.push(points[0]);
  L.polyline(points,{color:'green', weight:2,}).addTo(mymap);
  console.log(JSON.stringify(points));
  document.getElementById('close_path').disabled =true;
  document.getElementById('put_point').disabled =true;

}

document.getElementById('test_point').addEventListener("click", test_point)

function test_point(e)
{
  let message = "";
  let winds = point_in_poligon(marker,points);
  if (winds)
  message=winds+" winds. The point is inside polygon";
  else
  message = winds+" winds. The point is outside polygon";
  
  marker.bindPopup(marker.getLatLng().toString()+"<br>"+message).openPopup();

}


/*  

function point_in_poligon2(p)
{
  let crosses = 0;
  let plat = p.getLatLng().lat;
  let plng = p.getLatLng().lng;
  if (plat > maxlat || plat<minlat)
    return false;
  else if (plng> maxlng || plng<minlng)
    return false;
  else
  {
    
    let pslngth = ps.length;
    for (let i = 1;i<pslngth;i++)
    {
      if (line_equation (p,ps[i-1],ps[i]) )
      crosses+=1;
    }
  }
  return crosses%2;
}

function line_equation (p,p1,p2)
{
  let p1x = p1.lng;
  let p1y = p1.lat;
  let p2x = p2.lng;
  let p2y = p2.lat;
  let px = p.getLatLng().lng;
  let py = p.getLatLng().lat;
  
  let l = (p2y-p1y)/(p2x-p1x);
  let b = p1y - l*p1x;
  if ((px < (py-b)/l) && ((p1y<py && p2y>py) || (p1y>py && p2y<py)) )
    return true;
  return false;
}*/
// Copyright 2000 softSurfer, 2012 Dan Sunday
// This code may be freely used and modified for any purpose
// providing that this copyright notice is included with it.
// SoftSurfer makes no warranty for this code, and cannot be held
// liable for any real or imagined damage resulting from its use.
// Users of this code must verify correctness for their application.
// a Point is defined by its coordinates {int x, y;}
//===================================================================
 

// isLeft(): tests if a point is Left|On|Right of an infinite line.
//    Input:  three points P0, P1, and P2
//    Return: >0 for P2 left of the line through P0 and P1
//            =0 for P2  on the line
//            <0 for P2  right of the line
//    See: Algorithm 1 "Area of Triangles and Polygons"
/*function isLeft( P0, P1, P2 )
{
    return ( (P1.x - P0.x) * (P2.y - P0.y)
            - (P2.x -  P0.x) * (P1.y - P0.y) );
}*/
//===================================================================


// cn_PnPoly(): crossing number test for a point in a polygon
//      Input:   P = a point,
//               V[] = vertex points of a polygon V[n+1] with V[n]=V[0]
//      Return:  0 = outside, 1 = inside
// This code is patterned after [Franklin, 2000]
/*function cn_PnPoly( P, V, n )
{
    let  cn = 0;    // the  crossing number counter

    // loop through all edges of the polygon
    for (let i=0; i<n; i++) 
    {    // edge from V[i]  to V[i+1]
       if (((V[i].y <= P.y) && (V[i+1].y > P.y))     // an upward crossing
        || ((V[i].y > P.y) && (V[i+1].y <=  P.y))) { // a downward crossing
            // compute  the actual edge-ray intersect x-coordinate
            let vt = (float)(P.y  - V[i].y) / (V[i+1].y - V[i].y);
            if (P.x <  V[i].x + vt * (V[i+1].x - V[i].x)) // P.x < intersect
                 ++cn;   // a valid crossing of y=P.y right of P.x
        }
    }
    return (cn&1);    // 0 if even (out), and 1 if  odd (in)

}*/
//===================================================================
// wn_PnPoly(): winding number test for a point in a polygon
//      Input:   P = a point,
//               V[] = vertex points of a polygon V[n+1] with V[n]=V[0]
//      Return:  wn = the winding number (=0 only when P is outside)
/*function wn_PnPoly( P, V, n )
{
    let  wn = 0;    // the  winding number counter

    // loop through all edges of the polygon
    for (let i=0; i<n; i++) {   // edge from V[i] to  V[i+1]
        if (V[i].y <= P.y) {          // start y <= P.y
            if (V[i+1].y  > P.y)      // an upward crossing
                 if (isLeft( V[i], V[i+1], P) > 0)  // P left of  edge
                     ++wn;            // have  a valid up intersect
        }
        else {                        // start y > P.y (no test needed)
            if (V[i+1].y  <= P.y)     // a downward crossing
                 if (isLeft( V[i], V[i+1], P) < 0)  // P right of  edge
                     --wn;            // have  a valid down intersect
        }
    }
    return wn;
}*/


