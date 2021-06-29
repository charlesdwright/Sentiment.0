$(document).ready(function(){
  "use strict";

//-------------- ol6.5 ------------------------------------------

      var theLayers=new ol.layer.Group({
        title: "Layers",
        layers: []
      })

      var raster = new ol.layer.Tile({
        source: new ol.source.OSM()
      });

      var source = new ol.source.Vector({wrapX: false});
      var vector = new ol.layer.Vector({source: source});

  //-------------------collapse the OSM watermark ---------------
      var attribution = new ol.control.Attribution({
        collapsible: false,
      });
      attribution.setCollapsible(true);
      attribution.setCollapsed(true);
  //-------------------------------------------------------------

  //-------------------- map and view ---------------------------
      var view = new ol.View({
        zoom: 15,
        projection: 'EPSG:4326',
        //center: ol.proj.fromLonLat([2.1833, 41.3833])
      });
      var map = new ol.Map({
        layers: [raster, vector],
        target: 'map',
        view: view,
        controls: ol.control.defaults({attribution: false}).extend([attribution]),
      });

      map.addLayer(theLayers);
  //-------------------------------------------------------------

  //------------------------ geolocate --------------------------
    var home=[];

    var geolocation = new ol.Geolocation({
      tracking: true,
      projection: view.getProjection()
    });

    geolocation.on('change', function(evt) {
      var coord = geolocation.getPosition();

      if(home !== coord){
        setHome(coord);
      }

     });

    var home;
    function setHome(coord,zoom){
      home=coord;
      if(!zoom) {zoom=15;}

      view.setCenter(home);
      // Home marker
      var marker = new ol.Overlay({
        position: coord,
        positioning: 'center-center',
        element: document.getElementById('marker'),
        stopEvent: false,
      });

      map.addOverlay(marker);
      var theMarker=$("#marker");
      if (!theMarker.is(":visible")){
        theMarker.toggle(500);
      }

      view.setZoom(zoom);
    }


    geolocation.on('error', function (error) {
      //default to NY, NY, baby.
      var info = document.getElementById('info');
        setHome([-73.9664, 40.7817],14);
    });
  //--------------------- end geo --------------------------


  //setTimeout(() => map.updateSize(), 1);
  //this is sheer genius:  https://stackoverflow.com/a/28129658/15867360
    //document.getElementsByTagName("html")[0].style.visibility = "visible";
    //document.getElementById("map").style.visibility = "visible";
    //$("#map").toggle();
    $("#map").attr("style","visibility:visible");



  //------------------- show coords ------------------------
  map.addControl(new ol.control.MousePosition({
      prefix: 'Lat | Lon:  ',
      separator: ' | ',
      numDigits: 4,
      emptyString:'',//'Click anywhere for Lat | Lon',
      displayProjection: "EPSG:4326",
      coordinateFormat: ol.coordinate.createStringXY(4)
    }));
  //----------------------- end ----------------------------


  //--------------- interactions ----------------------------

      var draw =new ol.interaction.Draw({source: source}); // global so we can remove it later
      var drag = new ol.interaction.Translate();
      var select = new ol.interaction.Select();

      function addInteraction(type) {

        if (type !== 'None' && type !== 'Drag') {
          draw = new ol.interaction.Draw({
            source: source,
            type: type,
          });
          map.addInteraction(draw);
        }

        if (type == 'Drag') {map.addInteraction(drag);}

        if (type== 'None') {}
    }

      function toggleControl(geometry) {

        map.removeInteraction(draw);
        map.removeInteraction(drag);
        //map.removeInteraction(select);
        addInteraction(geometry);

      }

  //--------------- end interactions ----------------------------

  //--------------- click drawmode on --------------------

      var drawMode = new Boolean(false);
      var j=0;

      map.on('singleclick', function(evt) {
        drawMode=true;
        drawMenu(drawMode);

      if($( "input:checked" ).length >0){

        var shape=$( "input:checked" ).attr("geometry");
        var feature = map.forEachFeatureAtPixel(evt.pixel,
          function(feature, one){

            //var shape=document.getElementById('spn-chk-x').innerHTML.split(' ')[0];

            feature.set("shape",shape);
            feature.set("id",j);
            try{
              feature.set("area",feature.getGeometry().getArea());
            } catch {
              feature.set("area","n/a");
            };

            j++;
          });
        };
      });

        var theFeatures = function(){
        //Get the array of features
          var blah="";
          var theArray=[];
          var theFeature={};
          var i=0;
          var features = vector.getSource().getFeatures();

          // Go through this array and get coordinates of their geometry.
          features.forEach(function(feature) {

           theFeature.shape=feature.get("shape");
           theFeature.id=i;
           theFeature.area=feature.get("area");
           theFeature.coordinates=feature.getGeometry().getCoordinates();

           if(theFeature.shape=="Point"){
             theFeature.closest_point_to_home="n/a";
           } else {
             theFeature.closest_point_to_home=feature.getGeometry().getClosestPoint(home);
           }

           theArray.push(JSON.parse(JSON.stringify(theFeature)));

            // console.log("=======" + i + "th feature in the function =======");
            // console.log(theArray[i]);
            // console.log("=======feature=======");

           i++
          });

          return theArray;
    };


  //--------------- 2x-click exit drawmode --------------------

      map.on('dblclick', function(evt) {

        //showFeatures();

        if (drawMode){
          evt.preventDefault();
          drawMode=false
          drawMenu(drawMode);


          try {
            removeDupes();
          }
          catch(err) {
            alert("muh typerror: " + err.message);
          }

            draw.setActive(false);
            map.removeInteraction(draw);
      }


});
  //--------------- end 2x-click exit drawmode --------------------

//--------------- utils -----------------------

String.prototype.hash = function() {
var self = this, range = Array(this.length);
for(var i = 0; i < this.length; i++) {
  range[i] = i;
}
return Array.prototype.map.call(range, function(i) {
  return self.charCodeAt(i).toString(16);
}).join('');
}

var captionBox=$("#caption-box");
var drawBox=$("#draw-box");
var buttonBox=$("#button-box");
var infoBox=$("#info-box");

function drawMenu(drawMode){
  if(drawMode){
    if (captionBox.is(":visible")){
      buttonBox.toggle(500);
      drawBox.toggle(500);
      captionBox.toggle(500);
    }
  } else {
      captionBox.toggle(500);
      drawBox.toggle(500);
      buttonBox.toggle(500);
     if (infoBox.is(":visible")){
        infoBox.toggle(500);
     }
    }
}

function removeDupes(){
var obj ={};
var index=0;
var look4Dupes=[];
var features = vector.getSource().getFeatures();

//iterate over features on vector layer
features.forEach(function(feature) {

  console.log(feature.getGeometry().getCoordinates());

  //hash & stash, cuz
  var theHash =feature.getGeometry().getCoordinates().join().hash();
  look4Dupes.push(theHash);
  obj[index]=theHash;

  console.log(index + "  " + obj[index]);
  index++;

});//end for loop

var dupe=look4Dupes.filter((e, i, a) => a.indexOf(e) !== i);

//get key form value
var key="";
for(key in obj){
  console.log(key);
  console.log(obj[key]);

  if (obj[key]==dupe){
    console.log("removing: " + key);
    source.removeFeature(features[key]);
  };
};

}
//-------------------------- end utils --------------------------


//---------------------------  buttons --------------------------
//   document.getElementById('show').addEventListener('click', function () {
//     alert("SHOWing!");
//     // Get the array of features
//       var features = vector.getSource().getFeatures();
//
//       // Go through this array and get coordinates of their geometry.
//       console.log("-- features -- ")
//       features.forEach(function(feature) {
//         console.log(feature.getGeometry().getCoordinates());
//       });
//     });
//
//     document.getElementById('undo').addEventListener('click', function () {
//         draw.removeLastPoint();
//       });
//
//     document.getElementById('testthis').addEventListener('click', function () {
//           //removeDupes();
//           //showFeatures();
//
//       alert("test this!");
//
// });


      function drawLine(coords){

        var theFeature= new ol.Feature({
            geometry: new ol.geom.LineString(coords),
            shape: 'Line'
        });

        var lineStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
            color: '#ff4d4d',
            width: 1.5,
            lineDash: [5,5,5]
          })
        });

        theFeature.setStyle(lineStyle);
        source.addFeature(theFeature);

        view.setCenter(home);
        view.setZoom(15);

       };

      function neareastPoints(){
       var features = vector.getSource().getFeatures();

         // Go through this array and get coordinates of their geometry.
         features.forEach(function(feature) {

          drawLine([home, feature.getGeometry().getClosestPoint(home)]);

         });
      };

      $( "input" ).on( "click", function() {
         let geometry=$( "input:checked" ).attr("geometry");
         console.info("geometry :" + geometry);
         toggleControl(geometry);
      });



//       var radioToolbar=$(".radio-toolbar");
//       radioToolbar.on("click", function(){
//
//         alert("cclick!");
// //        toggleControl(radioPoint.attr("geometry"));
//
//           const rbs = document.querySelectorAll('input[name="radioButton"]');
//             let selectedValue;
//             for (const rb of rbs) {
//                 if (rb.checked) {
//                     selectedValue = rb.geometry;
//                     break;
//                 }
//             }
//             alert(selectedValue);
//
//
//       });
//






    // //radio buttons
    // var radioPoint=$("#radioPoint");
    // radioPoint.on("click", function(){
    //
    //   toggleControl(radioPoint.attr("geometry"));
    //
    //
    // });
    //
    // var radioLine=$("#radioLine");
    // radioLine.on("click", function(){
    //
    //   toggleControl(radioLine.attr("geometry"));
    //
    // });
    //
    // var radioPolygon=$("#radioPolygon");
    // radioPolygon.on("click", function(){
    //
    //   toggleControl(radioPolygon.attr("geometry"));
    //
    // });

    var yButton=$("#checkbox-y");
    yButton.on("click", function(){

      alert("do " + document.getElementById('spn-chk-y').innerHTML + " stuff");
      //showFeatures();

      neareastPoints();

    });

    var buttonInfo=$("#buttonInfo");
    var infoBox=$("#info-box");
        buttonInfo.click(function(e){
        console.log("clicked buttonInfo");
      //  document.getElementById("info-box").style.visibility = "visible";
        infoBox.toggle();
        getInfo();
        //alert(buttonInfo.attr("Value"));

    });

    var buttonRefresh=$("#buttonRefresh");
        buttonRefresh.click(function(e){
        console.log("clicked buttonRefresh");

        alert(buttonRefresh.attr("Value"));

    });

    var buttonHome=$("#buttonHome");
        buttonHome.click(function(e){
        console.log("clicked buttonHome");

        view.setCenter(home);
        view.setZoom(15);

    });



//output box?
//enable box-2
function getInfo(){


 var f=theFeatures();
 var i = 0;
 for (i=0;i<f.length;i++){

   console.log("i: " +  i+" ; " + JSON.stringify(f[i]));

   };

   //show the output, <pre> tag tells html to leave it unformatted.
        document.getElementById('info-box').innerHTML="<pre>" + JSON.stringify(f, null, 1) + "</pre>";
}


    var zButton=$("#checkbox-n");
    zButton.on("click", function(){

      alert("do " + document.getElementById('spn-chk-n').innerHTML + " stuff");

    });

//---------------------- end buttons --------------------------

}); //end jQuery wrapper
