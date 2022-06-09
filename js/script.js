jQuery(document).ready(function($) {

  // remove the loader div
  setTimeout(function() {
    $('#loader').css('opacity', '0');
    setTimeout(function() {
      $('#loader').css('display', 'none');
    }, 300);
  }, 100);

  // When the user scrolls down, hide the menu. When the user scrolls up, show the menu
  var prevScrollpos = window.pageYOffset;
  window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      showMenu();
    } else if (currentScrollPos > window.innerHeight - 150) {
      hideMenu();
    }
    prevScrollpos = currentScrollPos;
  }


  // Collapse menu when clicked
  document.onclick = function() {
    var nav = $('#menuSections');
    if (nav.css("maxHeight") != "0px") {
      nav.removeClass('expanded')
      $("#menuToggler").removeClass("is-active");
      $("#menu").removeClass("menu-bg");

    }
  }

  // Hide menu when click on section
  $('li a').on("click", function() {
  setTimeout(hideMenu, 800);
});

});

// Menu functions
function hideMenu() {
  var menuHeight = $('#menu').outerHeight(true);
  if (menuHeight < window.innerHeight/2) {
    document.getElementById("menu").style.top = -menuHeight + "px";
  }
};

function showMenu() {
  document.getElementById("menu").style.top = "0";
}

function collapseMenu() {

  $("#menuToggler").toggleClass("is-active");
  $("#menuSections").toggleClass("expanded");
  $("#menu").toggleClass("menu-bg");

}
