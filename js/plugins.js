// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Fast click: https://github.com/ftlabs/fastclick
$(function() {
    FastClick.attach(document.body);

//Add IE class
    var ms_ie = false;
    var ua = window.navigator.userAgent;
    var old_ie = ua.indexOf('MSIE ');
    var new_ie = ua.indexOf('Trident/');
    var edge = ua.indexOf('Edge/');

    if ((old_ie > -1) || (new_ie > -1) || (edge > -1)) {
        ms_ie = true;
    }

    if ( ms_ie ) {
        $("html").addClass("ie");
    }


// Load the photo gallery/lightbox plugin
    $("#lightGallery").lightGallery({
        speed: 500,
        showAfterLoad: false,
        thumbnail: false,
        controls: true,
        preload: 3,
        download: false,
        counter: false,
    });

    $( ".map" ).click(function() {
        $(this).find("iframe").addClass("js-map-on");
    });

// Contact Form
    $( ".js-modal-close" ).click(function() {
        $(".modal-overlay").toggleClass("is-open");
        $(".modal").toggleClass("is-open");
    });

    $( ".modal-overlay" ).click(function() {
        $(this).toggleClass("is-open");
        $(".modal").toggleClass("is-open");
    });

    $( ".js-modal-open" ).click(function(e) {
        e.preventDefault();
        $("#contact-form").show();
        $(".modal").find(".alert").hide();
        $(".modal-overlay").toggleClass("is-open");
        $(".modal").toggleClass("is-open");
    });

    // Validate form using validation plugin
    $("#contact-form").validate({
        errorPlacement: function(error, element) {
            error.insertAfter( element.prev("label") );
        }
    });

    $("#btn-email-send").click(function(){
        if ($("#contact-form").valid()){
            captureLead();
        } else {
            console.log("Form did not validate. If it should have validated, check jQuery Validation plugin and settings.")
        }
    });

    $(".alert").click(function(e){
      $("#contact-form").show();
      $(".modal").find(".alert").hide();
    });
});


function captureLead() {

    // Lead Capture
    var dataString = {
      profileIdToken: profileIdToken,
      listingIdToken: listingIdToken,
      email: $('#email').val(), // get from form
      firstName: $('#name').val(),  // get from form
      'Subject': $('#subject').val(),
      'Message': $('#body').val(), // get from form
      'Property Website': hostedUrl
    };
    $.ajax({
      type: "POST",
      url: deployEnv + "/omc/leadCapture.ipv",
      data: Base64.encode(JSON.stringify(dataString)),  // NOTE: Base64 is a javascript library to be included in design, see code block below.
      success: function() {
        $("#contact-form").hide(300);
        $(".modal").find(".alert").show(300).html("Your message has been sent. <br>An agent will contact you shortly.").css( "color", "#222" );
        $("#btn-email-send").prop('disabled',false);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){
        $("#contact-form").hide(300);
        $(".modal").find(".alert").show(300).html("Sorry, your message failed to send. <br><br><a href='#' style='color:red;' id='submitError'>Please try again.</a>").css( "color", "red" ); // status code and message is present on XMLHttpRequest object
        $("#btn-email-send").prop('disabled',false);
      }
    });

    $("#btn-email-send").prop('disabled',true);

}


//Check video URLs and figure our their source and ID
function testUrlForMedia(pastedData) {
    var success = false;
    var media   = {};
    if (pastedData.match('(www.)?youtube|youtu\.be')) {
        if (pastedData.match('embed')) { youtube_id = pastedData.split(/embed\//)[1].split('"')[0]; }
        else { youtube_id = pastedData.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]; }
        media.type  = "youtube";
        media.id    = youtube_id;
        success = true;
    }
    else if (pastedData.match('(player.)?vimeo\.com')) {
        vimeo_id = pastedData.split(/video\/|vimeo\.com\//)[1].split(/[?&]/)[0];
        media.type  = "vimeo";
        media.id    = vimeo_id;
        success = true;
    }
    else if (pastedData.match('player\.soundcloud\.com')) {
        soundcloud_url = unescape(pastedData.split(/value="/)[1].split(/["]/)[0]);
        soundcloud_id = soundcloud_url.split(/tracks\//)[1].split(/[&"]/)[0];
        media.type  = "soundcloud";
        media.id    = soundcloud_id;
        success = true;
    }
    if (success) { return media; }
    else { return false; }
    return false;
}



// Base64 Encode
var Base64 = {
// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
// public method for encoding
encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = Base64._utf8_encode(input);
    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    }
    return output;
},
// public method for decoding
decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }
    output = Base64._utf8_decode(output);
    return output;
},
// private method for UTF-8 encoding
_utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }
    return utftext;
},
// private method for UTF-8 decoding
_utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while ( i < utftext.length ) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }
    return string;
}

}
