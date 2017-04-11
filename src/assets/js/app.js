$(document).foundation();

$( document ).ready(function() {
	$('#btn-close-offcanvas').attr({
		'tabindex': '-1'
	});
	$('#off-canvas-menu a').attr({
		'tabindex': '-1'
	});

	
	$(".off-canvas").on("opened.zf.offcanvas", function(e) {
		// Trap focus to given element
		$('#btn-close-offcanvas').attr({
			'tabindex': '0'
		});
		$('#off-canvas-menu a').attr({
			'tabindex': '0'
		});
		Foundation.Keyboard.trapFocus($('.off-canvas'));

	});

	$(".off-canvas").on("closed.zf.offcanvas", function(e) {
		// Release focus from given element
		Foundation.Keyboard.releaseFocus($('.off-canvas'));
		$('#btn-open-offcanvas').focus();
		$('#btn-close-offcanvas').attr({
			'tabindex': '-1'
		});
		$('#off-canvas-menu a').attr({
			'tabindex': '-1'
		});


	});

	$('#btn-close-offcanvas').click(function() {
		$('#btn-open-offcanvas').focus();
	});

	Foundation.Keyboard.register('menu', {
	  'CTRL_M': 'open'
	});
	var menuActions = {
		open: function() {
			$('#btn-open-offcanvas').click();
			return true;
		}
	};
	// Handle actions for the menu (e.g. in event handler on body)
	$('body').keydown(function(e) {
	  // Handle actions for the menu
	  Foundation.Keyboard.handleKey(e, 'menu', $.extend(menuActions, {
	    handled: function() {
	      e.preventDefault();
	    }
	  }));
	});




Element.prototype.documentOffsetTop = function () {
  return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );
};

Element.prototype.scrollIntoViewCenter = function () {
  window.scrollTo( 0, this.documentOffsetTop() - (window.innerHeight / 2 ) );
};


window.addEventListener("keyup", myScript);


function myScript(e) {
  if ('9' == e.keyCode) {  // tab = 9
    //find and vertically center focused input
    //document.activeElement.scrollIntoViewCenter();
    document.activeElement.documentOffsetTop();
    
  }
}


});