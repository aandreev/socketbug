/* ========== BEGIN THRID PARTY DEGUG CODE ========== */

/**
 * JavaScript Debug - v0.4 - 6/22/2010
 * http://benalman.com/projects/javascript-debug-console-log/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 * 
 * With lots of help from Paul Irish!
 * http://paulirish.com/
 */
if(typeof(debug) === 'undefined')
{
	window.debug=(function(){var i=this,b=Array.prototype.slice,d=i.console,h={},f,g,m=9,c=["error","warn","info","debug","log"],l="assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace".split(" "),j=l.length,a=[];while(--j>=0){(function(n){h[n]=function(){m!==0&&d&&d[n]&&d[n].apply(d,arguments)}})(l[j])}j=c.length;while(--j>=0){(function(n,o){h[o]=function(){var q=b.call(arguments),p=[o].concat(q);a.push(p);e(p);if(!d||!k(n)){return}d.firebug?d[o].apply(i,q):d[o]?d[o](q):d.log(q)}})(j,c[j])}function e(n){if(f&&(g||!d||!d.log)){f.apply(i,n)}}h.setLevel=function(n){m=typeof n==="number"?n:9};function k(n){return m>0?m>n:c.length+m<=n}h.setCallback=function(){var o=b.call(arguments),n=a.length,p=n;f=o.shift()||null;g=typeof o[0]==="boolean"?o.shift():false;p-=typeof o[0]==="number"?o.shift():n;while(p<n){e(a[p++])}};return h})();
}

/* ========== BEGIN SOCKETBUG CONSOLE CODE ========== */

/**
 * Socketbug Server - v0.1 - 6/16/2011
 *
 * Website: http://www.socketbug.com
 * Cource: http://github.com/manifestinteractive/socketbug
 * 
 * Copyright (c) 2011 Manifest Interactive, LLC
 * Licensed under the LGPL v3 licenses.
 * http://www.socketbug.com/license/
 */
if(typeof(socketbug) === 'undefined')
{
	var socketbug = {

		/* Check if we're connected to Socketbug */
		connected: false,
		
		/* Store Socketbug Console Session ID */
		application_id: null,
		
		/* Store Socketbug Console Session ID */
		session_id: null,
		
		/* Setup Socket.io to Listen to Server */
		io: new io.Socket('localhost', { port: 8080, rememberTransport: false }),
		
		/* Direct Connect Method */
		connect: function()
		{
			this.io.connect();
		},
		
		/* Direct Disconnect Method */
		disconnect: function()
		{
			this.io.disconnect();
		},
		
		/* Direct Send Method */
		send: function(data)
		{
			jQuery('#loading').fadeIn('fast');
			
			this.io.send(data);
		},
		
		/* Send Javascript Command */
		js: function(javascript)
		{
			jQuery('#loading').fadeIn('fast');
			
			var json = { 
				'application_id': this.application_id, 
				'session_id': this.session_id, 
				'command': 'javascript', 
				'js': javascript 
			};
			
			this.io.send(JSON.parse(JSON.stringify(json)));
		},
		
		/* Get list of connected users */
		users: function()
		{
			this.io.send(data);
		},
		
		view_source: function()
		{
			jQuery('#loading').fadeIn('fast');
			
			var json = { 
				'application_id': this.application_id, 
				'session_id': this.session_id, 
				'command': 'src', 
				'js': 'document.getElementsByTagName("html")[0].innerHTML' 
			};
			
			this.io.send(JSON.parse(JSON.stringify(json)));
		}

	};
	
	/* Capture Connecting Event */
	socketbug.io.on('connecting', function(transport_type)
	{
		debug.log('Connecting to Socketbug via ' + transport_type + '...');
		socketbug.connected = false;
	});

	/* Capture Connect Event */
	socketbug.io.on('connect', function()
	{
		debug.log('Socketbug Connected');
		jQuery('#connect').attr('checked', true).trigger('change');
		socketbug.connected = true;
		jQuery('#loading').fadeOut('slow');
	});

	/* Capture Connect Failed Event */
	socketbug.io.on('connect_failed', function()
	{
		debug.error('Failed to Connect to Socketbug');
		jQuery('#connect').attr('checked', false).trigger('change');
		socketbug.connected = false;
		socketbug.disconnect();
		jQuery('#loading').fadeOut('slow');
	});

	/* Capture Message Event */
	socketbug.io.on('message', function(data)
	{
		switch(typeof(data))
		{
			case 'string':
				if(data.substring(0,10) == 'sessionid:')
				{
					var sid = data.split(':', 2);
			
					debug.log('Socketbug Session ID: ' + sid[1]);
					
					socketbug.session_id = sid[1];
				}
				else
				{
					debug.log(data);
				}
		
				break;
				
			case 'object':
				debug.log(data);
				
				if(data.command == 'javascript')
				{
					eval(data.js);
					
					jQuery('#command').val('');
				}
				else if(data.command == 'src')
				{
					eval('var src = '+data.js);
					
					src = src.replace(/</g,'&lt;');
					src = src.replace(/>/g,'&gt;');
					
					var brush = new SyntaxHighlighter.brushes.Xml(),
					code = src,html;
	
					brush.init(
					{ 
						'toolbar': false,
						'auto-links': true,
						'smart-tabs': true,
						'gutter': true
					});
					html = brush.getHtml(code);
					
					jQuery('#source_code').append('<pre></pre>');
					
					jQuery('#source_code pre').html(html);
					
					jQuery('#source_code').slideDown();
				}
				
				break;
		}
		
		jQuery('#loading').fadeOut('slow');
	});

	/* Capture Close Event */
	socketbug.io.on('close', function()
	{
		debug.warn('Connection to Socketbug Closed');
		socketbug.connected = false;
	});

	/* Capture Disconnect Event */
	socketbug.io.on('disconnect', function()
	{
		debug.warn('Socketbug Disconnected');
		socketbug.connected = false;
		jQuery('#connect').attr('checked', false).trigger('change');
	});

	/* Capture Reconnect Event */
	socketbug.io.on('reconnect', function(transport_type, reconnectionAttempts)
	{
		debug.log('Successfully Reconnected to Socketbug via ' + transport_type + ' with Attempt #' + reconnectionAttempts);
		socketbug.connected = false;
	});

	/* Capture Reconnecting Event */
	socketbug.io.on('reconnecting', function(reconnectionDelay, reconnectionAttempts)
	{
		debug.warn('Attempt #' + reconnectionAttempts + ' at Reconnecting to Socketbug...');
		socketbug.connected = false;
	});

	/* Capture Close Event */
	socketbug.io.on('reconnect_failed', function()
	{
		debug.error('Failed to Reconnect to Socketbug');
		socketbug.connected = false;
	});
	
	/* auto connect when page loads */
	socketbug.io.connect();
}

/* ========== BEGIN CONSOLE WEB CODE ========== */

var recent_commands = [
	"alert('');",
	"$('#')",
	"$('')",
	"$('').addClass('');",
	"$('').append('');",
	"$('').css('', '');",
	"$('').fadeIn();",
	"$('').fadeOut();",
	"$('').hide();",
	"$('').html('');",
	"$('').prepend('');",
	"$('').remove();",
	"$('').removeClass('');",
	"$('').show();",
	"$('').slideDown();",
	"$('').slideToggle();",
	"$('').slideUp();",
	"$('').text('');",
	"$('').toggle();",
	"$('').toggleClass('');",
	"$('').trigger('');",
	"$('').val('');",
	"$('.')"

];

jQuery(document).ready(function()
{	
	var connect_checkbox = jQuery('#connect').iphoneStyle({ checkedLabel: 'On', uncheckedLabel: 'Off' });
	
	jQuery("#command").autocomplete({
		source: recent_commands
	});
	
	jQuery("button").button();
	
	jQuery('#connect').change(function(){
		if(socketbug.connected)
		{
			socketbug.disconnect();
		}
		else if( !socketbug.connected)
		{
			socketbug.connect();
		}
	});
	
	jQuery('select#command_list').selectmenu({ style:'popup' });
	
	jQuery('#close_source').button({ icons: { primary: "ui-icon-circle-close" }, text: false }).click(function(){ jQuery('#source_code').slideUp(); });
			

	jQuery('#run_command').click(function(){
		switch(jQuery('select#command_list').val())
		{
			case 'view_source':
				jQuery('#command_list').selectmenu("value", "list");
				
				jQuery('#source_code pre').remove();
				jQuery('#source_code').slideUp();
				socketbug.view_source();
				
				break;
		}
	});
	
	jQuery('#command').keypress(function(e){
		code= (e.keyCode ? e.keyCode : e.which);
		if (code == 13)
		{
			if(jQuery('#command').val() != '')
			{
				recent_commands.push(jQuery('#command').val());
				
				$("#command").autocomplete({
					source: recent_commands
				});
				
				socketbug.js(jQuery('#command').val());
				e.preventDefault();
			}
			else
			{
				jQuery('#command').blur();
			}
		}
	});
	
	jQuery('#command').dblclick(function(){
		jQuery('#command').val('');
	});
});