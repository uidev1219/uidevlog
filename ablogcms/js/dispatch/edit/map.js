ACMS.Dispatch.Edit.MAP_NOTFOUND="見つかりませんでした";ACMS.Dispatch.Edit.MAP_INPUT="住所、又はスポット名を入力してください";ACMS.Dispatch.Edit.map=function(item){var $img=$(".js-map_editable-container",item).add(".column-map",item);var $lat=$(".js-map_editable-lat",item).add(':input[name^="map_lat_"]',item);var $lng=$(".js-map_editable-lng",item).add(':input[name^="map_lng_"]',item);var $zoom=$(".js-map_editable-zoom",item).add(':input[name^="map_zoom_"]',item);var $panorama=$(".js-map_editable-panorama",item).add(':input[name^="map_panorama_"]',item);var $pitch=$(".js-map_editable-pitch",item).add(':input[name^="map_view_pitch_"]',item);var $zoomView=$(".js-map_editable-zoom-view",item).add(':input[name^="map_view_zoom_"]',item);var $heading=$(".js-map_editable-heading",item).add(':input[name^="map_view_heading_"]',item);var $activate=$(".js-map_editable-activate",item).add(':input[name^="map_view_activate_"]',item);if(!$img.size()||!$img.is("img")){return false}if(!$lat.size()||!$lat.is(":input")){return false}if(!$lng.size()||!$lng.is(":input")){return false}var query=ACMS.Library.parseQuery($img.attr("src").replace(/^[^?]*\?/,""));var latlng=query.center.split(",");var zoom=parseInt(query.zoom,10);if($zoom.size()&&$zoom.val().length){zoom=parseInt($zoom.val(),10)}var GMap=null;var GMarker=null;var _center=null;function getCenter(){return new google.maps.LatLng($lat.val(),$lng.val())}function latLngOnChange(streetViewControl){var center=getCenter();GMap.panTo(center);if(GMarker!==null){GMarker.setPosition(center,streetViewControl)}}function setPosition(latLng,streetViewControl){GMap.panTo(latLng);if(GMarker!==null){GMarker.setPosition(latLng,streetViewControl)}var lat=Math.round(latLng.lat()*1e6);var lng=Math.round(latLng.lng()*1e6);$lat.val(lat/1e6);$lng.val(lng/1e6)}var keyCatch=function(){if(document.all){return function(e){return e.keyCode}}else if(document.getElementById){return function(e){return e.keyCode?e.keyCode:e.charCode}}else if(document.layers){return function(e){return e.which}}}();var $div=$($.parseHTML('<div style="overflow:hidden;" class="acms-admin-gmap-box"></div>'));$div.css("width","".concat($img.width(),"px"));$div.css("height","".concat($img.height(),"px"));$img.replaceWith($div);function activate(streetViewControl,clickChanged){_center=getCenter();GMap=new google.maps.Map($div.get(0),{zoom:Number.isNaN(parseInt($zoom.val()))?14:parseInt($zoom.val()),center:_center,mapTypeId:google.maps.MapTypeId.ROADMAP,streetViewControl:streetViewControl,scrollwheel:false,styles:ACMS.Config.s2dStyle});if(!streetViewControl){GMarker=new google.maps.Marker({position:_center,map:GMap,draggable:true});google.maps.event.addListener(GMarker,"dragend",function(event){setPosition(event.latLng,streetViewControl)});$lat.change(function(){latLngOnChange(streetViewControl)});$lng.change(function(){latLngOnChange(streetViewControl)})}else{var center=getCenter();var heading=$heading.val();var pitch=$pitch.val();var zoomView=$zoomView.val();var config={position:{lat:center.lat(),lng:center.lng()},pov:{heading:Number.isNaN(parseFloat(heading))?0:parseFloat(heading),pitch:Number.isNaN(parseFloat(pitch))?0:parseFloat(pitch),zoom:Number.isNaN(parseFloat(zoomView))?0:parseFloat(zoomView)}};var panorama=new google.maps.StreetViewPanorama($panorama.get(0),config);var defaultPov=panorama.getPov();$pitch.val(defaultPov.pitch);$heading.val(defaultPov.heading);$zoomView.val(defaultPov.zoom);panorama.addListener("pov_changed",function(){var pov=panorama.getPov();$pitch.val(pov.pitch);$heading.val(pov.heading);$zoomView.val(pov.zoom)});google.maps.event.addListener(panorama,"position_changed",function(){var pos=panorama.getPosition();$lat.val(pos.lat());$lng.val(pos.lng());$panorama.width($div.width());$panorama.height($div.height());$panorama.show();google.maps.event.trigger(panorama,"resize");$div.hide()});GMap.setStreetView(panorama);if(clickChanged){setTimeout(function(){if(!panorama.projection){alert("指定の位置にストリートビューがありません。ストリートビューの範囲にペグマンをドロップしてください。")}},1e3)}}if($zoom.size()){$zoom.change(function(){GMap.setZoom(parseInt($(this).val(),10))});google.maps.event.addListener(GMap,"zoom_changed",function(){$zoom.val(GMap.getZoom())})}var $stxt=$(".js-editable_map-search_text",item).add(':input[name="mapSearchTexts[]"]',item);var $sbtn=$(".js-editable_map-search_button",item).add(':input[name="mapSearchButtons[]"]',item);if($stxt.size()&&$sbtn.size()){$stxt.val(ACMS.Dispatch.Edit.MAP_INPUT).removeAttr("disabled").addClass("default");$sbtn.removeAttr("disabled");var search=function search(event){event.preventDefault();var address=$stxt.val();if(!address){return false}$stxt.attr("disabled","disabled");$sbtn.attr("disabled","disabled");var geocoder=new google.maps.Geocoder;geocoder.geocode({address:address},function(results,status){if(status==google.maps.GeocoderStatus.OK){setPosition(results[0].geometry.location,streetViewControl)}else{$stxt.val(ACMS.Dispatch.Edit.MAP_NOTFOUND);$stxt.addClass("default")}$stxt.removeAttr("disabled");$sbtn.removeAttr("disabled")});return false};$sbtn.click(search);$stxt.bind("keydown",function(e){if(keyCatch(e)===13){$sbtn.click();return false}});$stxt.focus(function(){var $self=$(this);if($self.is(".default")){$self.val("").removeClass("default")}$self.select()});$stxt.blur(function(){var $self=$(this);if($self.val()==""){$self.val(ACMS.Dispatch.Edit.MAP_INPUT);$self.addClass("default")}})}}$activate.on("change",function(){if($activate.prop("checked")){activate(true,true);$(".js-streetview-table",item).show();$(".js-map-table",item).hide()}else{$panorama.hide();$div.show();$heading.val("");$pitch.val("");$zoomView.val("");activate(false);$(".js-streetview-table",item).hide();$(".js-map-table",item).show()}});var panoramaMode=false;if($activate.prop("checked")){panoramaMode=true}if($lat.val().length&&$lng.val().length){activate(panoramaMode)}else{$img.click(function(){if(!$lat.val().length){$lat.val(latlng[0])}if(!$lng.val().length){$lng.val(latlng[1])}if($zoom.size()){$zoom.val(zoom)}activate(panoramaMode,false)})}};