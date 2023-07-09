jQuery.expr.filters.isFloatUnit=function(elem){return/(image|map|youtube|eximage|media)-(left|right)/.test(elem.className)};jQuery.expr.filters.isAlignmentUnit=function(elem){return elem.className.match(/(image|map|youtube|eximage|media)-(left|right|center)/)};var inplaceFilterDie=null;ACMS.Dispatch.Edit._inplace=function(elm){this.self=elm;this.controll=false;var $self=$(this.self);$self.attr("tabindex",0);$self.unbind("mouseover focus");$self.bind("mouseover focus",function(e){if(!ACMS.Config.Edit.stateSort){elm.inplace.hover()}});$self.unbind("mouseout focusout");$self.bind("mouseout focusout",function(){inplaceFilterDie=setTimeout(function(){if(!this.controll){elm.inplace.removeHover()}},800);return false});inplaceSortMode=false};ACMS.Dispatch.Edit._inplace.prototype={hover:function(){if(this.isLoading()){return false}else{this.removeHover()}if($(".js-edit_inplace-sort_placeholder").length){return false}if($(".js-edit_inplace-hovering").length){$(".js-edit_inplace-hovering").remove()}this.$hover=$($.parseHTML('<div class="js-edit_inplace-hovering" />'));this.overlay(this.$hover,$(this.self),$(this.self).parent());this.ctrlMenu();this.editBtn=$("#js-edit_inplace-control-edit");var own=this;this.editBtn.unbind("click");this.editBtn.bind("click",function(){own.modify(own.self)})},removeHover:function(){clearTimeout(inplaceFilterDie);$(".js-edit_inplace-hovering").hide();$("#js-edit_inplace-control").hide()},removeHolder:function(){$("#js-edit_inplace-holder, #js-edit_inplace-units").hide()},ctrlMenu:function(){var $ctrl=$("#js-edit_inplace-control");if(!$ctrl.length){var dupli='<button id="js-edit_inplace-control-add_duplicate"><i class="acms-admin-icon-add-duplicate"></i><span class="js-edit_inplace-control-label">複製</span></button>',below='<button id="js-edit_inplace-control-add_below"><i class="acms-admin-icon-add-below"></i><span class="js-edit_inplace-control-label">追加</span></button>',edit='<button id="js-edit_inplace-control-edit"><i class="acms-admin-icon-control-edit"></i><span class="js-edit_inplace-control-label">編集</span></button>',del='<button id="js-edit_inplace-control-remove"><i class="acms-admin-icon-delete"></i><span class="js-edit_inplace-control-label">削除</span></button>',move='<button id="js-edit_inplace-control-move"><i class="acms-admin-icon-sort2"></i><span class="js-edit_inplace-control-label">移動</span></button>';$ctrl=$($.parseHTML('<div id="js-edit_inplace-control">'+edit+below+dupli+move+del+"</div>")).appendTo("body");$ctrl.find("i").css({padding:"1px","font-size":"16px"});$ctrl.find(".js-edit_inplace-control-label").css({display:"block"});$ctrl.bind("mouseover",function(){clearTimeout(inplaceFilterDie);this.controll=true});var own=this;$ctrl.bind("mouseout",function(){inplaceFilterDie=setTimeout(own.removeHover,100);this.controll=false})}$ctrl.show().position({of:this.$hover,my:"left bottom",at:"left top"});$ctrl.css("z-index",2048);var $item=$(this.self);$("#js-edit_inplace-control-remove").unbind().bind("click",{self:this.self},this.remove);$("#js-edit_inplace-control-add_duplicate").unbind().bind("click",{self:this.self},this.duplicate);$("#js-edit_inplace-control-add_below").unbind().bind("click",{self:this.self,pos:"below"},this.placeHold);$("#js-edit_inplace-control-move").unbind().bind("click",function(){ACMS.Config.Edit.directSortItem=$item})},placeHold:function(data){var self=data.data.self;var pos=data.data.pos;var $holder=$("#js-edit_inplace-holder");var $units=$("#js-edit_inplace-units");$.getJSON(ACMS.Library.acmsLink({tpl:"ajax/unit-add-list.json",Query:{cache:(new Date).getTime()}},true),function(list){self.inplace.removeHover();self.inplace.removeHolder();if(!$holder.size()){$holder=$($.parseHTML('<div id="js-edit_inplace-holder" />'))}if(!$units.size()){$units=$($.parseHTML('<div id="js-edit_inplace-units" />')).appendTo($holder)}else{$units.empty()}Array.prototype.in_array=function(val){for(var i=0,l=this.length;i<l;i++){if(this[i]==val){return true}}return false};for(var i=0;i<list.type.length;i++){var type=list.type[i],label=list.label[i];$($.parseHTML("<button>"+label+"</button>")).bind("click",{self:self,type:type,pos:pos},self.inplace.add).appendTo($units)}$($.parseHTML('<button class="cansel">キャンセル</button>')).bind("click",self.inplace.removeHolder).appendTo($units);if(pos=="below"){$holder.hide().insertAfter(self)}else{$holder.hide().insertBefore(self)}$holder.fadeIn("fast");$units.show()});return false},overlay:function($elm,$self,$parent){var pLeft=parseInt($parent.css("padding-left").replace(/px/,""));if($parent.css("position").match(/static/)){$parent.css("position","relative")}var $unit=$self.children().filter(":isFloatUnit");var $contain,$first,$last;if(!!$unit.size()){$self=$unit;$contain=$self.parent().children().filter('[class!="clearHidden"]')}else{$contain=$self.children().filter('[class!="clearHidden"]')}$first=$contain.first();$last=$contain.last();if(!$first.length)$first=$self;if(!$last.length)$last=$self;var margin={top:parseInt($first.css("margin-top").replace(/px/,"")),bottom:parseInt($last.css("margin-bottom").replace(/px/,"")),left:parseInt($first.css("margin-left").replace(/px/,"")),right:parseInt($first.css("margin-right").replace(/px/,""))};var pos=$self.position();pos.top=$first.position().top+margin.top;pos.bottom=$last.position().top+$last.outerHeight(true);var $prev=$self.prev().children().filter(":isFloatUnit");var $prevUnit=$self.prev();var realityPosition=$first.offset().top;var clearAttr=$first.css("clear");$first.css({clear:"both"});var clearPosition=$first.offset().top;$first.css({clear:clearAttr});if(realityPosition!==clearPosition){var $temp=false;var $current=$self;var i=0;do{i++;$temp=$current.prev().children().filter(":isFloatUnit");$current=$current.prev()}while(!$temp.size()&&i<99);$prev=$temp}var width=$self.innerWidth(),height;if($contain.size()==1){height=$last.innerHeight()}else{height=pos.bottom-pos.top}if(height<35){height=35}var $isSteppedDown=false;if(!!$prev.size()){var sPos=$prev.position(),sHeight=$prev.innerHeight(),sWidth=$prev.innerWidth(),pPos=$prevUnit.position(),pHeight=$prevUnit.innerHeight();sPos.bottom=sPos.top+sHeight;sPos.left=sPos.left-pLeft;pPos.bottom=pPos.top+pHeight;if(sPos.bottom>=pos.top){var belowWidth;if($prev.get(0)&&$prev.get(0).className.match(/(image|map|youtube|eximage|file)-left/)){belowWidth=sPos.left+sWidth;width=width-(sPos.left+sWidth);pos.left=sPos.left+sWidth+pLeft}else{belowWidth=sWidth;width=width-sWidth}if(1&&sPos.bottom<=pos.bottom&&width*height<belowWidth*(pos.bottom-sPos.bottom)&&!$(".js-edit_inplace-sort_placeholder").length){$isSteppedDown=true;$elm.css({width:width-4,height:pos.bottom-pPos.bottom,position:"absolute",left:pos.left,top:pPos.bottom,zIndex:2048}).appendTo($parent);return}}}if($first.get(0)&&$first.get(0).className.match(/(image|map|youtube|eximage|file)-center/)){margin.left=0;width=$self.innerWidth()}if(!$isSteppedDown&&!$(".js-edit_inplace-sort_placeholder").length){$elm.css({width:width-4,height:height,position:"absolute",left:pos.left,top:pos.top,zIndex:2048}).prependTo($parent)}},close:function(){$("#js-edit_inplace-box").hide();$("#js-edit_inplace-title").hide()},isLoading:function(){return!!$(".js-edit_inplace-loading").size()},isHovering:function(){return!!$(".js-edit_inplace-hovering").size()},add:function(data){var self=data.data.self,type=data.data.type,pos=data.data.pos,$self=$(self),$parent=$self.parent();if(self.inplace.isLoading()){return false}self.inplace.removeHover();self.inplace.close();var $loader=$('<div class="js-edit_inplace-loading" />');self.inplace.overlay($loader,$self,$parent);var $img=$('<div class="js-acms_loader"></div>');if(ACMS.Dispatch.Utility.browser().ltIE9){$img=$('<img class="js-acms_loader_img" src="'+ACMS.Config.root+'themes/system/images/ajax-loader.gif"/>')}$loader.append($img);if(!self.id.match(/^(\d+)-(\d+)$/)){return false}else{var eid=RegExp.$1,utid=RegExp.$2}var url=ACMS.Library.acmsLink({eid:eid,utid:utid,tpl:"ajax/unit-add-single.html",admin:"entry-update-unit-"+type,Query:{hash:Math.random().toString(),pos:pos}},true);self.inplace.dialog(self,url)},modify:function(self){var $self=$(self),$parent=$self.parent();if(self.inplace.isLoading()){return false}self.inplace.removeHover();self.inplace.removeHolder();self.inplace.close();var $loader=$('<div class="js-edit_inplace-loading" />');self.inplace.overlay($loader,$self,$parent);var $img=$('<div class="js-acms_loader_img js-acms_loader"></div>');if(ACMS.Dispatch.Utility.browser().ltIE9){$img=$('<img class="js-acms_loader_img" src="'+ACMS.Config.root+'themes/system/images/ajax-loader.gif"/>')}$loader.append($img);if(!self.id.match(/^(\d+)-(\d+)$/)){return false}else{var eid=RegExp.$1;var utid=RegExp.$2}var url=ACMS.Library.acmsLink({eid:eid,utid:utid,tpl:"ajax/unit-update-single.html",admin:"entry-update-unit",Query:{hash:Math.random().toString()}},true);self.inplace.dialog(self,url)},update:function(data){$(this).attr("disabled",true).unbind();var self=data.data.self,btn=this,$form=$(btn).parent().attr("target","js-edit_inplace-async"),$iframe=$('iframe[name="js-edit_inplace-async"]'),eid=$('[name="eid"]',$form).val(),utid=$('[name="clid[]"]',$form).val();if(!$iframe.size()){$iframe=$($.parseHTML('<iframe name="js-edit_inplace-async" style="display:none;"></iframe>')).appendTo("body")}$form.unbind().submit(function(){$iframe.unbind().load(function(){var html=$iframe.contents().find("body").html(),$html=$($.parseHTML(html)),$tgt;if(html===""){alert(ACMS.i18n("direct_edit.message1"))}if(utid==""){$tgt=$html;if($("#"+$html.attr("id")).size()>=1){self.inplace.removeHolder();self.inplace.close();return true}if(!jQuery.support.opacity){$tgt.insertAfter($("#js-edit_inplace-holder"))}else if(jQuery.support.checkOn&&jQuery.support.noCloneEvent){$tgt.insertAfter($("#js-edit_inplace-holder"))}else{var ua=navigator.userAgent.toLowerCase();if(ua.indexOf("msie")!=-1){$tgt.insertAfter($("#js-edit_inplace-holder"))}else{$tgt.insertAfter($("#js-edit_inplace-holder")).fadeTo(250,.1).fadeTo(300,1)}}self.inplace.removeHolder()}else{var inner=$html.html();$tgt=$("#"+eid+"-"+utid);$tgt.attr("class",$html.attr("class"));$tgt.attr("data-align",$html.attr("data-align"));if(!jQuery.support.opacity){$tgt.html(inner)}else{$tgt.fadeTo(250,.1).html(inner).fadeTo(450,$html.css("opacity"))}}ACMS.Dispatch.Utility($tgt);ACMS.Dispatch.Edit($tgt.parent());ACMS.Dispatch($tgt);self.inplace.adjustAlign();self.inplace.close()})}).submit();return false},dialog:function(self,url){var $editinBox=$("#js-edit_inplace-box"),$html={};if(!$editinBox.size()){$editinBox=$($.parseHTML('<div id="js-edit_inplace-box" />')).appendTo("body")}$.ajax({type:"GET",url:url,dataType:"html",error:function(xhr,statusText){$editinBox.empty().append($(xhr.responseText)).css("background-color","white");$(".js-edit_inplace-loading").remove();$editinBox.fadeIn("fast").position({of:window,my:"center center"}).draggable({handle:ACMS.Config.Edit.itemHeadMark,opacity:.8,scroll:true,distance:5})},success:function(html){$html=$($.parseHTML(html));$('#more, .sorthandle, .togglebody, .formEntryActionUnit, [for^="input-checkbox-file_edit_"]',$html).remove();$editinBox.empty().append($html);$(".js-edit_inplace-loading").remove();$editinBox.fadeIn("fast").position({of:window,my:"center center"}).draggable({handle:ACMS.Config.Edit.itemHeadMark,opacity:.8,scroll:true,distance:5});ACMS.Dispatch.Edit($editinBox);ACMS.Dispatch($editinBox);if(ACMS.Library.exFeature()){var keyCatch=function(){if(document.all){return function(e){return e.keyCode}}else if(document.getElementById){return function(e){return e.keyCode?e.keyCode:e.charCode}}else if(document.layers){return function(e){return e.which}}}();$("textarea:first-child",$editinBox).focus().bind("keydown",function(e){if(13===keyCatch(e)&&(e.metaKey===true||e.ctrlKey===true)){$("#js-edit_inplace-submit",$editinBox).click();return false}})}$(".removethis",$editinBox).unbind().attr("class","closethis").bind("click",self.inplace.close);$("#js-edit_inplace-submit",$editinBox).unbind().bind("click",{self:self},self.inplace.update)}})},remove:function(data){var self=data.data.self;if(confirm(ACMS.i18n("direct_edit.message2"))){self.inplace.voidPost(self,{ACMS_POST_Unit_Remove:true,formToken:window.csrfToken},function(){var $self=$(self);$self.unbind("mouseover");self.inplace.removeHover();$self.remove()})}else{return false}},duplicate:function(data){var self=data.data.self;self.inplace.duplicatePost(self,function(res){var $self=$(self);var $clone=$(".js-edit_inplace",$(res));$(res).each(function(index,el){if($(el).hasClass("js-edit_inplace")){$clone=$(el);return false}});$clone.insertAfter($self);ACMS.Dispatch.Utility($clone);ACMS.Dispatch.Edit($clone.parent());$clone.fadeTo(250,.1).fadeTo(450,1);self.inplace.adjustAlign()})},duplicatePost:function(self,callback){if(!$(self).attr("id").match(/^(\d+)-(\d+)$/)){return false}else{var eid=RegExp.$1,utid=RegExp.$2}var url=ACMS.Library.acmsLink({eid:eid,utid:utid,Query:{hash:Math.random().toString()}},true);$.ajax({url:url,type:"post",dataType:"html",data:{ACMS_POST_Unit_Duplicate:true,formToken:window.csrfToken},success:callback})},voidPost:function(self,data,callback){if(!$(self).attr("id").match(/^(\d+)-(\d+)$/)){return false}else{var eid=RegExp.$1,utid=RegExp.$2}var url=ACMS.Library.acmsLink({eid:eid,utid:utid,Query:{hash:Math.random().toString()}},true);$.ajax({url:url,type:"post",dataType:"html",data:data,success:callback})},adjustAlign:function(){$(".js-edit_inplace").each(function(){var $unit=$(this);var $self=$unit.children().filter(":isAlignmentUnit"),$prev=$unit.prev().children().filter(":isAlignmentUnit"),$parent=$self.parent();if(!!$unit.size()){$unit.get(0).className.match(/(left|center|right|auto)/);var self_align=RegExp.$1}if(!!$unit.prev().size()){$unit.prev().get(0).className.match(/(left|center|right|auto)/);var prev_align=RegExp.$1}$unit.children().filter("hr.clearHidden").remove();do{if(typeof prev_align=="undefined"){break}if("left"==self_align&&"left"==prev_align){break}if("rigth"==self_align&&"right"==prev_align){break}if("auto"==self_align){if("left"==prev_align){break}if("right"==prev_align){break}if("auto"==prev_align){break}}$unit.prepend('<hr class="clearHidden" />')}while(false)})}};