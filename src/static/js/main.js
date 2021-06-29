$(document).ready(function(){
  "use strict";
/*
  var yermammy = "<div class='w3-content w3-container w3-padding-64 w3-center' id='imgMap'><div id='map' class='map' ></div></div>";

  function clockImage(element){

  //  alert("in clockImage");
      //clearInterval(blah);
      alert(i);
      var x = element.src;
      var i = 0;
        function animationLoop(){
            element.src=x.replace(/[01]?\d\.jpg/, i+".jpg");
          i++;
          if(i==12){
            i=0;
          }
        }
        let blah = setInterval(animationLoop,50);
  }

  function loopImage(element){
    //pick one at random, according to how many are in the folder..."n.jpg"
  //  alert("in loopImage");

      var x = element.src;
      var i = 0;
            function animationLoop(){

              y = x.replace(/[01]?\d\.jpg/, Math.floor(Math.random() * 11)+".jpg");
            element.src= y;
        i++;
        if(i==10){
          clearInterval(blah);
          alert(i);
        }
        }
        let blah = setInterval(animationLoop,2000);
      }
*/
  function swapImage(element){
    //pick one at random, according to how many are in the folder...
    var x = element.src;
    var y=x;
    while (x==y){
      y = x.replace(/-[0-9].jpg/,"-"+ Math.floor(Math.random() * 2)+".jpg");
    }
    element.src= y;
  }

/*
  function toggleImage(){

    var x = document.getElementById("imgResult");
     if (x.style.display === "none") {
       x.style.display = "block";
     } else {
       x.style.display = "none";
     }

  }
*/
  function loadDoc() {
    event.preventDefault();
    var theURL = "sentiment?input="+document.getElementsByName("input")[0].value;

    var imgIndex = Math.floor(Math.random() * 3); //for now...
    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

          document.getElementById("imgSentiment").src = "/static/sentiment/"+this.responseText+"-"+imgIndex+".jpg";

        }
      };
      xhttp.open("GET", theURL, true);
      xhttp.send();

      document.getElementById("imgResult").style.display="block";

  }

/*
  // var boxButton=$("#boxes");
  // boxButton.on("click", function(){
  //
  //   alert("i've been clicked");
  //
  // });
  // Modal Image Gallery
  // function onClick(element) {
  //   //document.getElementById("img01").src = element.src;
  //   document.getElementById(element.getAttribute("data-modal-name")).style.display = "block";
  //   //alert(element.getAttribute("data-modal-name"));
  //   //get your modal body by class and change its html
  //   //document.getElementById("modal-body").innerHTML = "<div >some-text</div>";
  //   refreshMap();
  //   var captionText = document.getElementById("caption-"+element.getAttribute("data-modal-name"));
  //   captionText.innerHTML = element.alt;
  // }
*/
// ---- model01
  var box_1 =$("#box-1");
  var model01=$("#modal01");
  box_1.on("click", function(){

    var captionText = document.getElementById("caption-"+ box_1.attr("data-modal-name"));
    captionText.innerHTML = box_1.attr("alt");

    model01.fadeToggle(500);
  });


  $("#modalForm").submit(function(){

    loadDoc()

  });


// --end model01

// ---- model02
  var model02=$("#modal02");
  var box_2=$("#box-2");
  box_2.on("click", function(){

    var captionText = document.getElementById("caption-"+ box_2.attr("data-modal-name"));
    captionText.innerHTML = box_2.attr("alt");
    //this is THE money line:

    try{
      $('#modal02-body').load("/static/maps.html" ,function(){
  //        $('#modal02').modal({show:true});
      });
    } catch(err) {
      if (e instanceof ReferenceError) {
        console.info("modal02 load error: " + err.message);
      }

    }

    //    $('.modal-body').load('content.html',function(){
    //        $('#myModal').modal({show:true});
    //    });

    model02.fadeToggle(500);

  });

// ---- end model02

  var closeModal= $('span[name$="closeModal"]')
  closeModal.on("click", function(){
    //    model02.fadeToggle(250);
  //  document.getElementById("modalForm").reset();

    $('#modalForm').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
    })

    location.reload();
    });

  box_1.mouseover(function() {
    swapImage(document.getElementById('box-1'));
  });

/*
  // Modal Image Gallery
  function onClick(element) {
    //document.getElementById("img01").src = element.src;
    document.getElementById(element.getAttribute("data-modal-name")).style.display = "block";
    //alert(element.getAttribute("data-modal-name"));
    //get your modal body by class and change its html
    //document.getElementById("modal-body").innerHTML = "<div >some-text</div>";
    refreshMap();
    var captionText = document.getElementById("caption-"+element.getAttribute("data-modal-name"));
    captionText.innerHTML = element.alt;
  }


  // Change style of navbar on scroll
  window.onscroll = function() {myFunction()};
  function myFunction() {
      var navbar = document.getElementById("myNavbar");
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
          navbar.className = "w3-bar" + " w3-card" + " w3-animate-top" + " w3-white";
      } else {
          navbar.className = navbar.className.replace(" w3-card w3-animate-top w3-white", "");
      }
  }

  // Used to toggle the menu on small screens when clicking on the menu button
  function toggleFunction() {
      var x = document.getElementById("navDemo");
      if (x.className.indexOf("w3-show") == -1) {
          x.className += " w3-show";
      } else {
          x.className = x.className.replace(" w3-show", "");
      }
  }
  */
});
