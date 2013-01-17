/*
 * Custom Form Elements
 *
 * Requirments: jQuery 1.5.0+
 * Version: 0.7.3
 * Author: Anton Zaytsev (http://antonzaytsev.com)
 *
 * Simple usage:
 * $('select, input').cfe();
 *
 */

(function($){
  $.fn.cfe = function(options) {
    options = $.extend({
      placeholder:{
        tag: 'span',
        'class': 'placeholder'
      },
      wrap: {
        tag: 'span',
        'class': ''
      }
    }, options);

    this.each(function(){
      var text, placeholder, name, type, tag, wrap,
          el = $(this),
          placeholder_classes = [];

      if (el.data('cfe') == 1)
        return;

      el.data('cfe', 1);

      tag = String(el[0].tagName).toLowerCase();

      placeholder_classes.push(options['placeholder']['class']);

      wrap = $('<'+options.wrap.tag+'/>', {
        'class': "cfe-styled"
      });

      el.after(wrap);
      wrap.append(el);

      switch(tag){

        case 'select':
          wrap.addClass('cfe-'+tag);

          if ($(this).attr('cfe-class')) {
            wrap.addClass($(this).attr('cfe-class'));
          }

          placeholder = $("<"+options['placeholder']['tag']+"/>")
            .addClass(placeholder_classes.join(' '))
            .data('element', el)
            .text((el.find('option:selected').length == 1 ? el.find('option:selected') : el.find('option:first') ).text());

          el.before(placeholder);

          if (!el.attr("disabled")) {
            el.bind('change', function(){
              el.prev().text(el.find('option:selected').text());
            });
            el.bind('keyup', function(){
              el.prev().text(el.find('option:selected').text());
            });
          }
          else {
            el.parent().addClass("disabled");
          }

          var classes = $.trim(el.attr('class')).split(' ');
          if (classes.length > 0)
            $.each(classes, function(index, klass){
              if (klass)
                wrap.addClass(klass + '-cfe');
            });

          break;

        case 'input':
          type = el.attr('type');
          text = '';

          wrap.addClass('cfe-'+type);
          switch (type) {

            case 'checkbox':
              if (el.is(':checked')) {
                wrap.addClass('checked');
              }

              placeholder = $("<"+options.placeholder.tag+"/>")
                .addClass(placeholder_classes.join(' '))
                .data('element', el);

              el.before(placeholder);
              el.data('placeholder',placeholder);

              /*
               * if checkbox is inside of label then we just need to handle click on checkbox
               * because click on placeholder will propagate to label
               * and click on label will trigger click on checkbox
               */
              el.bind('change.cfe', function(e){
                  e.stopPropagation();

                  if (!$(this).is(':checked'))
                    $(this).parent().removeClass('checked');
                  else
                    $(this).parent().addClass('checked');
              });

              // if checkbox is inside of label we should handle click on placeholder
              if (el.closest('label').length == 0){
                placeholder.bind('click.cfe', function(e){
                  var input = $(this).data('element');
                  input.click();
                });
              }
              break;

            case 'radio':
              placeholder = $("<"+options.placeholder.tag+" />")
                .addClass(placeholder_classes.join(' '))
                .data('element', el);

              el.data('placeholder', placeholder)
                .before(placeholder)
                .bind('change.cfe', function(e){
                  $('[name="'+$(this).attr('name')+'"]:not(:checked)').parent().removeClass('checked');
                  if ($(this).is(':checked')) {
                    $(this).parent().addClass('checked');
                  }
                })
                .trigger('change.cfe');

              /* same like with checkbox */
              if (el.closest('label').length == 0){
                placeholder.bind('click.cfe', function(e){
                  $(this).data('element').click().trigger('change');
                });
              }
              break;

            case 'file':
              var filenamePlaceholder = $('<span class="file-name-placeholder" />');
              placeholder = $('<span class="placeholder">Choose file</span>');

              el.after(filenamePlaceholder);
              el.after(placeholder);

              var reWin = /.*\\(.*)/,
                  reUnix = /.*\/(.*)/,
                  fileTitle;

              el.bind('change.cfe', function() {

                var file = $(this).val();

                fileTitle = file.replace(reWin, "$1") //file name - win
                                .replace(reUnix, "$1"); //fiele name - unix

                if (fileTitle.length == 0) {
                  filenamePlaceholder.hide().html('');
                  return;
                }

                filenamePlaceholder.show().html(fileTitle);

                if (filenamePlaceholder.attr('ext')){
                  filenamePlaceholder.removeClass('ext_'+filenamePlaceholder.attr('ext'));
                  filenamePlaceholder.removeAttr('ext');
                }

                var ext = fileTitle.replace(/.*(\..*)/, "$1"); // file extension

                if (ext) {
                  ext = ext.toLowerCase().substr(1);
                  filenamePlaceholder.addClass('ext_'+ext);
                  filenamePlaceholder.attr('ext', ext);
                }

              }).trigger('change');

              break;
          }
          break;
      }

    });

    return this;
  }
})(jQuery);