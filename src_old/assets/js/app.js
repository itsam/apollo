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
			//document.activeElement.documentOffsetTop();
			//alert('tab is pressed A');
			
		}
	}


});









/*
* @function toggleCheckBox
*
* @desc Toogles the state of a checkbox and updates image indicating state based on aria-checked values
*
* @param   {Object}  event  -  Standard W3C event object
*
*/

function toggleCheckbox(event) {
	
	  var node = event.currentTarget
	  var image = node.getElementsByTagName('img')[0]
	
	  var state = node.getAttribute('aria-checked').toLowerCase()
	
	  if (event.type === 'click' || 
		  (event.type === 'keydown' && event.keyCode === 32)
		  ) {
			  if (state === 'true') {
				node.setAttribute('aria-checked', 'false')
				image.src = './themes/apollo/assets/img/checkbox-unchecked-black.png'
			  }
			  else {
				node.setAttribute('aria-checked', 'true')
				image.src = './themes/apollo/assets/img/checkbox-checked-black.png'
			  }  
			  	
		event.preventDefault()
		event.stopPropagation()
	  }
	
	}
	
	/*
	* @function focusCheckBox
	*
	* @desc Adds focus to the class name of the checkbox
	*
	* @param   {Object}  event  -  Standard W3C event object
	*/
	
	function focusCheckbox(event) {
	  event.currentTarget.className += ' focus'
	}
	
	/*
	* @function blurCheckBox
	*
	* @desc Adds focus to the class name of the checkbox
	*
	* @param   {Object}  event  -  Standard W3C event object
	*/
	
	function blurCheckbox(event) {
	  event.currentTarget.className = event.currentTarget.className .replace(' focus','')
	}

