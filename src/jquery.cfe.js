/*
    Custom Form Elements

    Requirments: jQuery 1.3.2+
    Version: 0.7
    Author: Anton Zaycev (http://antonzaycev.ru)
	
    Simple usage:
        $('select, input').cfe();

    input params:
        <tag> <description>
*/

(function($){
    $.fn.cfe = function(o) {
        var text, placeHolder, name, type, tag;

        o = $.extend({
            placeHolder : 'span',
            wrpTag : 'span'
        }, o);

        this.each(function(){
            var el = $(this), placeHolder_class = [];

            el.data('cfe', 1);

            tag = String(el[0].tagName).toLowerCase();
            
            var inputName = el.attr('name');
            name = inputName.replace(/(\]\[)|(\])|(\[)/gi,'_');

            placeHolder_class.push('pholder');

            switch(tag){
                
                case 'select':
                    el.wrap('<span id="'+name+'_wrp" class="cfe_'+tag+'_wrp" />');

                    placeHolder = $("<"+o.placeHolder+"/>")
                                  .addClass(placeHolder_class.join(' '))
                                  .data({'element':el})
                                  .text(el.find('option:selected').text());
                    el.before(placeHolder);

                    if (!el.attr("disabled")) {
                        el.change(function(){
                            el.prev().text(el.find('option:selected').text());
                        });
                        el.keyup(function(){
                            el.prev().text(el.find('option:selected').text());
                        });
                    }
                    else {
                        el.prev().addClass("disabled");
                    }
                    
                    break;

                case 'input':
                    var type = el.attr('type');
                    text = '';

                    switch (type) {

                        case 'checkbox':
                            el.wrap('<'+o.wrpTag+' class="cfe_'+type+'_wrp" />');

                            if (el.is(':checked')) {
                                placeHolder_class.push('checked');
                            }

                            placeHolder = $("<"+o.placeHolder+"/>")
                                  .addClass(placeHolder_class.join(' '))
                                  .data({'element':el});
                            el.before(placeHolder);

                            /*
                             * if checkbox is inside of label then we just need to handle click on checkbox
                             * because click on placeholder will propagate to label
                             * and click on label will trigger click on checkbox
                             */
                            el
                                .data('pholder',placeHolder)
                                .bind('change.cfe', function(e){
                                    var pholder = $(this).data('pholder');

                                    if (!$(this).is(':checked'))
                                        pholder.removeClass('checked');
                                    else
                                        pholder.addClass('checked');

                                    e.stopPropagation();
                                });

                            /* if checkbox is inside of label
                            * we should handle click on placeholder*/
                            if (!$('#'+el.attr('id'),'label[for='+el.attr('id')+']').size()){
                                placeHolder.bind('click.cfe', function(e){
                                    //just click is not enough because it wont trigger change
                                    $(this).data('element').click().change();
                                });
                            }

                            /* obviously, we need to track hover on label */
                            $('label[for='+el.attr('id')+']').hover(function(){
                                el.data('pholder').toggleClass('hover')
                            });
                            break;

                        case 'radio':
                            el.wrap('<'+o.wrpTag+' class="cfe_'+type+'_wrp" />');

                            if (el.is(':checked')) {
                                placeHolder_class.push('checked');
                            }

                            placeHolder = $("<"+o.placeHolder+"/>")
                                  .addClass(placeHolder_class.join(' '))
                                  .data({
                                      'element':el,
                                      'name':el.attr('name')
                                  });
                            el
                                .data('pholder',placeHolder)
                                .before(placeHolder)
                                .bind('change.cfe', function(e){
                                    $('[name="'+$(this).attr('name')+'"]').prev().removeClass('checked');
                                    $(this).prev().toggleClass('checked');
                                });

                             /* same like with checkbox */
                            if (!$('#'+el.attr('id'),'label[for='+el.attr('id')+']').size()){
                                placeHolder.bind('click.cfe', function(e){
                                    $(this).data('element').click().change();
                                });
                            }

                            /* obviously, we need to track hover on label */
                            $('label[for='+el.attr('id')+']').hover(function(){
                                el.data('pholder').toggleClass('hover')
                            });

                            break;

                        case 'file':
                            el.wrap('<div class="cfe_file_wrp" />');
                            var wrp = el.parent();

                            el.after('<div title="Choose file" class="fakeButton">Choose file</div>'+
                                    '<div class="fileNamePlaceHolder" />')
                                .addClass('cfe_file')
                                .wrap('<span class="'+el.get(0).id+'_input_wrp" />');

                            el.bind('change.cfe', function() {

                                var file = $(this).val(),
                                    fileName = wrp.find('.fileNamePlaceHolder'),
                                    reWin = /.*\\(.*)/,
                                    reUnix = /.*\/(.*)/,
                                    fileTitle

                                fileTitle = file.replace(reWin, "$1") //file name - win
                                                .replace(reUnix, "$1"); //fiele name - unix
                                fileName.html(fileTitle);

                                if (fileTitle.length == 0) {
                                    fileName.hide()
                                    return;
                                }
                                fileName.show();

                                if (fileName.attr('ext')){
                                    fileName.removeClass('ext_'+fileName.attr('ext'));
                                    fileName.removeAttr('ext');
                                }

                                var ext = fileTitle.replace(/.*(\..*)/, "$1");// file extension

                                if (ext) {
                                    ext = ext.toLowerCase().substr(1);
                                    fileName.addClass('ext_'+ext);
                                    fileName.attr('ext', ext);
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