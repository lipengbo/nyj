// https://github.com/collinsp/jquery-colorramp
(function($){

  // default settings
  var CFG = {
    defaultRamp: "01.png",
    path: $("#jquery-colorramp-script").attr('src').replace(/main\.js.*/,'') || './'
  };

  // get the path from the loaded script tag if possible
  
  // global picker
  var $COLOR_RAMP_PICKER;

  // install handler runs once on demand
  var INSTALL_HANDLER = function() {
    // ensure style sheet is loaded
    if ($('#jq-colorramp-ColorRampStyleSheet').length==0) {
      $('head').append('<link id=jq-colorramp-ColorRampStyleSheet rel="stylesheet" href="' + CFG.path + 'style.css" type="text/css" />');
    }

    $.ajax({
      type: 'GET', url: CFG.path + 'rampindex.txt',
      error: function(){ alert('could not load ' + CFG.path + 'rampindex.txt'); },
      success: function(d) {
        var files = d.split("\n"); 
        var buf = ["<span id=jq-colorramp-ColorRampPicker><div id=jq-colorramp-ColorRampPickerOpts>"];
        for (var i=0,l=files.length;i<l;++i) {
          buf.push('<div class=jq-colorramp-ColorRampPickerOpt data-ramp="' + files[i]
            + '" style="background: url(' + CFG.path + 'ramps/' + files[i] + ');"></div>'); 
        }
        buf.push("</div></span>");
        $COLOR_RAMP_PICKER = $(buf.join(''));
        $COLOR_RAMP_PICKER.delegate(".jq-colorramp-ColorRampPickerOpt","click", function(){
          var $SelectedColorRamp = $COLOR_RAMP_PICKER.prev('.jq-colorramp-SelectedColorRamp');
          var old_image = /([^\/]+\.png)/i.test($SelectedColorRamp.css('background-image')) ? RegExp.$1 : undefined;
          var new_image = /([^\/]+\.png)/i.test($(this).css('background-image'))            ? RegExp.$1 : undefined;
          if (old_image == new_image) return true;
          $SelectedColorRamp.css('background-image', 'url(' + CFG.path + 'ramps/' + new_image + ')')
                            .colorramp('deactivate').trigger('change');
          return true;
        });
      }
    });
    INSTALL_HANDLER = undefined;
  };

  var methods = {
     // initialize the color ramp for this div
     init: function() {
       if (INSTALL_HANDLER) INSTALL_HANDLER();
       var ramp_url = this.attr('ramp') || CFG.defaultRamp;
       return this.click(function(){ $(this).colorramp('activate'); return true; })
                  .addClass('jq-colorramp-SelectedColorRamp')
                  .css('background', 'url(' + CFG.path + 'ramps/' + ramp_url + ')');
     },

     // return the global cfg object
     cfg: function() {
       return CFG;
     },

     // activate the picker
     activate: function() {
       var $this = $(this);
       $this.colorramp('deactivate');
       $this.after($COLOR_RAMP_PICKER);
       var old_image = /([^\/]+\.png)/i.test($this.css('background-image')) ? RegExp.$1 : undefined;
       var $currentSel = $COLOR_RAMP_PICKER.find('[data-ramp="'+old_image+'"]:first');
       if ($currentSel) {
         $currentSel.addClass('selected');
       }

       // install handler after click event is complete, that on the next click closes the picker
       setTimeout(function(){
         $(document).bind('click.jq-colorramp-deactivate', function() {
           $this.colorramp('deactivate');
           return true;
         });
       }, 10);

       return this;
     },

     // get the color ramp for the currently selected picker
     getColors: function(cb) {
       var $this = $(this);
       var img = /([^\/]+\.png)/i.test($this.css('background-image')) ? RegExp.$1 : undefined;
       var url = CFG.path + 'ramps/' + img + '.colors.txt';
       $.ajax({
         url: url,
         success: function(d) {
           var colors = d.split(/\ /);
           if (colors.length < 3 || colors[0].length != 6) {
             alert('unexpected output for ' + url);
           } else {
             cb(colors);
           }
         },
         error: function() {
           alert('could not load ' + url);
         }
       });
     },

     // close the picker for this color ramp widget
     deactivate: function() {
       $(document).unbind('click.jq-colorramp-deactivate');
       $COLOR_RAMP_PICKER.detach();
       $COLOR_RAMP_PICKER.find('.selected').removeClass('selected');
       return this;
     },

     // remove the color ramp decorations for this div
     destroy: function() {
       if (this.next().is($COLOR_RAMP_PICKER)) this.deactivate();
       this.unbind('.colorramp').removeClass('jq-colorramp-SelectedColorRamp');
       return this;
     }
  };

  $.fn.colorramp = function(method) {
    if (method in methods) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || ! method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.colorramp');
    }
  };

})(jQuery);
// END - https://github.com/collinsp/jquery-colorramp
