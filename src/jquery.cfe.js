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

            switch(tag){
                
                case 'select':
                    el.wrap('<span id="'+name+'wrp" class="cfe_'+type+'_wrp" />');
                    el.css({
                      'opacity':0,
                      'position':'relative',
                      'filter': 'alpha(opacity=0)',
                      'z-index': '5'
                    });

                    text = el.find('option:selected').text();

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
                    if (!text) {text = el.val();}
                    placeHolder_class.push('pholder');
                    break;

                case 'input':
                    var type = el.attr('type');
                    text = '';
                    placeHolder_class.push('pholder');

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
                             .after('<div title="Выбрать файл" class="fakeButton" />'+
                                    '<div class="fileNamePlaceHolder" /> <!--сюда мы будем вставлять имя файла и иконку-->')
                             .addClass('cfe_file')
                             .wrap('<span class="'+el.get(0).id+'_input_wrp" />')

                            el.bind('change', function() {

                                var file = $(this).val(),
                                    fileName = $(this).parent().parent().find('.fileNamePlaceHolder'),
                                    reWin = /.*\\(.*)/,
                                    reUnix = /.*\/(.*)/,
                                    fileTitle,
                                    pos

                                fileTitle = file.replace(reWin, "$1"); //выдираем название файла для windows
                                fileTitle = fileTitle.replace(reUnix, "$1"); //выдираем название файла для unix-систем
                                fileName.html(fileTitle);

                                if (fileTitle.length == 0) {
                                    fileName.hide()
                                    return;
                                }
                                var RegExExt =/.*.(\..*)/;
                                var ext = fileTitle.replace(RegExExt, "$1");//и его расширение

                                if (ext) {
                                    ext = ext.toLowerCase().substr(1);
                                    fileName.addClass('ext_'+ext);
                                }
                            });

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