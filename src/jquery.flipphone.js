/*
**********************************************************
FlipPhone.js
Version:		v0.1
Release:		_______ 00 2014
Site:			http://
Author:			Mike Zarandona | http://mikezarandona.com | @mikezarandona
License:		Licenced under the Creative Commons Attribution 3.0 Unported Free Culture License.
				You are free to share, copy, distribute, transmit, remix, adapt, and make commercial
				use of this work under the condition that you attribute the work.
Usage:			$('.phone-number').flipPhone();
**********************************************************
*/

(function ($, undefined) {
	$.fn.flipPhone = function (options) {

		// Override defaults with specified options.
		options = $.extend({}, $.fn.flipPhone.options, options);

		// Time to get to work
		return this.each(function () {

			// Minimize the number of DOM searches for efficiency
			var elem = $(this);

			// Append a special class of .flip-phone, and save it in a var
			elem.addClass('flip-phone');

			// Attach a handler for RWD
			var currentWidth = 0;

			$(window).on('resize', function() {
				if (elem.width != currentWidth) {
					console.log('refire!');
					normalizeWidths(elem);
				}
			});

			// Break the .html() into characters, wrap each that is a-z / A-Z
			var characters = elem.text().split('');

			var dynamicHTML = '';
			var letterCount = 0;

			// Loop through all the characters in the string, and wrap .letter around each letter
			for (i = 0; i < characters.length; i++) {

				if (isNaN(characters[i]) && (characters[i] != '-') && (characters[i] != '.') && (characters[i] != '/')) {

					// Evaluate based on upper case
					var thisLetterUpperCase = characters[i].toUpperCase();

					// Determine the digit associated with this letter
					var thisDigit = null;

					switch (characters[i]) {
						case 'A':
						case 'B':
						case 'C':
							thisDigit = 2;
							break;
						case 'D':
						case 'E':
						case 'F':
							thisDigit = 3;
							break;
						case 'G':
						case 'H':
						case 'I':
							thisDigit = 4;
							break;
						case 'J':
						case 'K':
						case 'L':
							thisDigit = 5;
							break;
						case 'M':
						case 'N':
						case 'O':
							thisDigit = 6;
							break;
						case 'P':
						case 'Q':
						case 'R':
						case 'S':
							thisDigit = 7;
							break;
						case 'T':
						case 'U':
						case 'V':
							thisDigit = 8;
							break;
						case 'W':
						case 'X':
						case 'Y':
						case 'Z':
							thisDigit = 9;
							break;
						default:
							thisDigit = 0;
							break;
					}

					// Only set the first 7 digits, set the rest to blank
					if (letterCount >= options.letterLimit) {
						thisDigit = '';
					}

					dynamicHTML += '<span class="letter letter-' + letterCount + '"><span data-digit="' + thisDigit + '">' + characters[i] + '</span></span>';
					letterCount++;
				}
				else {
					dynamicHTML += characters[i];
				}
			}

			// Write the new HTML structure to the element
			elem.html(dynamicHTML);

			// Normalize the widths to avoid number overlap
			var maxWidth = 0;
			var widestLetter = null;

			normalizeWidths(elem);

			function normalizeWidths(nrmlzr) {

				nrmlzr.find('.letter').each(function() {

					if ( $(this).width() > maxWidth ) {
						maxWidth = $(this).width();
						widestSpan = $(this);
					}
				});
				nrmlzr.find('.letter').css('min-width', maxWidth + 'px');
			}

			// Build the dynamic CSS to control the animations
			var dynamicCSS = '\
				<style type="text/css">\
					.flip-phone {\
						letter-spacing: ' + options.letterSpacing + 'px;\
					}\
					.flip-phone:hover .letter {\
						transition: all 200ms ease-in-out;\
						-webkit-transition: all 200ms ease-in-out;\
					}\
					\
					.flip-phone {\
						text-decoration: none;\
					}\
					\
					.letter {\
						display: inline-block;\
						overflow: hidden;\
						\
						vertical-align: top;\
					}\
					\
					.flip-phone:hover .letter { text-decoration: none; }\
					\
					.letter span {\
						display: block;\
						position: relative;\
						\
						-webkit-transition: -webkit-transform ' + options.speed + 'ms ease-in-out;\
						   -moz-transition: -moz-transform ' + options.speed + 'ms ease-in-out;\
							-ms-transition: -ms-transform ' + options.speed + 'ms ease-in-out;\
								transition: transform ' + options.speed + 'ms ease-in-out;\
						\
						-webkit-transform-origin: 50% 0%;\
						   -moz-transform-origin: 50% 0%;\
							-ms-transform-origin: 50% 0%;\
								transform-origin: 50% 0%;\
						\
						-webkit-transform-style: preserve-3d;\
						   -moz-transform-style: preserve-3d;\
							-ms-transform-style: preserve-3d;\
								transform-style: preserve-3d;\
					}\
					.flip-phone:hover .letter span {\
						width: auto;\
						text-rendering: optimizeLegibility;\
						-webkit-transform: translate3d( 0px, 0px, -30px ) rotateX( 90deg );\
						   -moz-transform: translate3d( 0px, 0px, -30px ) rotateX( 90deg );\
							-ms-transform: translate3d( 0px, 0px, -30px ) rotateX( 90deg );\
								transform: translate3d( 0px, 0px, -30px ) rotateX( 90deg );\
					}\
					\
					.letter span:after {\
						content: attr(data-digit);\
						\
						display: block;\
						position: absolute;\
						left: 20%;\
						\
						-webkit-transform-origin: 50% 0%;\
						   -moz-transform-origin: 50% 0%;\
							-ms-transform-origin: 50% 0%;\
								transform-origin: 50% 0%;\
						\
						-webkit-transform: translate3d( 0px, 105%, 0px ) rotateX( -90deg );\
						   -moz-transform: translate3d( 0px, 105%, 0px ) rotateX( -90deg );\
							-ms-transform: translate3d( 0px, 105%, 0px ) rotateX( -90deg );\
								transform: translate3d( 0px, 105%, 0px ) rotateX( -90deg );\
					}';

			// Loop through and create delays
			for (j = 0; j < letterCount; j++) {
				var thisDelay = 0;

				if (j < options.letterLimit) {
					thisDelay = options.delay;
				}

				dynamicCSS += '.flip-phone:hover .letter.letter-' + j + ' span {\
									transition-delay: ' + (thisDelay * j) + 'ms;\
									-webkit-transition-delay: ' + (thisDelay * j) + 'ms;\
								}'; 
			}

			dynamicCSS += '</style>';

			// Strip out the line breaks and tabs from the styles
			var dynamicCSSMin = dynamicCSS.replace(/(\r\n|\n|\r|\t)/gm,"");

			// Append styles to the <head>
			$('head').append(dynamicCSSMin);

		});

	};



	// Default the defaults
	$.fn.flipPhone.options = {
		speed:				450,
		delay:				100,
		letterSpacing:		0,
		letterLimit:		7
	};

})(jQuery);
