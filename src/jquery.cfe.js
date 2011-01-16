/*
    Custom Form Elements

    Requirments: jQuery 1.3.2+
    Version: 0.65
    Author: Anton Zaycev (http://antonzaycev.ru)
	
    Simple usage:
        $('select, input').cfe();
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

                            placeHolder.bind('click', function(){
                                
//                                $(this).data('element').trigger('click');
                                
                                if (!$(this).data('element').is(':checked')){
                                    $(this).addClass('checked');
                                }
                                else
                                    $(this).removeClass('checked');
                                
                            });

//                            el.bind('click', function(){
//                                console.log('checkbox changed', $(this).is(':checked'), $(this).attr('checked'));
//                            })

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
                            el.before(placeHolder);

                            placeHolder.bind('click', function(){
                                $('[name="'+$(this).data('name')+'"]').prev().removeClass('checked');
                                $(this)
                                    .toggleClass('checked')
                                    .data('element').click();
                            });

                            break;

                        case 'file':
                            el.wrap('<div class="cfe_file_wrp" />')
                             .after('<div title="Выбрать файл" class="fakeButton">Выбрать файл</div>'+
                                    '<div class="fileNamePlaceHolder" />')
                             .addClass('cfe_file')
                             .wrap('<span class="'+el.get(0).id+'_input_wrp" />')

                            el.bind('change.cfe', function() {

                                var file = $(this).val(),
                                    fileName = $(this).parent().parent().find('.fileNamePlaceHolder'),
                                    reWin = /.*\\(.*)/,
                                    reUnix = /.*\/(.*)/,
                                    fileTitle

                                fileTitle = file.replace(reWin, "$1"); //выдираем название файла для windows
                                fileTitle = fileTitle.replace(reUnix, "$1"); //выдираем название файла для unix-систем
                                fileName.html(fileTitle);

                                if (fileTitle.length == 0) {
                                    fileName.hide()
                                    return;
                                }
                                fileName.show();
                                
                                var RegExExt =/.*.(\..*)/;
                                var ext = fileTitle.replace(RegExExt, "$1");//и его расширение

                                if (fileName.attr('ext')){
                                    fileName.removeClass('ext_'+fileName.attr('ext'));
                                    fileName.removeAttr('ext');
                                }

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




/*
 $('*').each(function(){
    if ($(this).data('cfe') == 1){
var cl = $(this).clone()
$(this).parent().after(cl).remove();
cl.data('cfe', 0);
}
});
 */