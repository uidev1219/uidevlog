(self.webpackChunkuidev=self.webpackChunkuidev||[]).push([[507],{9117:function(t,e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=i(3600);e.default=function(t){t.style.visibility="visible",new n.FocusedImage(t)}},9099:function(t,e){"use strict";function i(t){for(var e=arguments.length,i=new Array(e>1?e-1:0),n=1;n<e;n++)i[n-1]=arguments[n];return i.forEach((function(e){return Object.keys(e).forEach((function(i){return t[i]=e[i]}))})),t}Object.defineProperty(e,"__esModule",{value:!0});var n={position:"relative",overflow:"hidden"},s={position:"absolute",top:"0",right:"0",bottom:"0",left:"0"},o={display:"block",maxWidth:"100%",touchAction:"none"},a={position:"absolute",cursor:"move",transform:"translate(-50%, -50%)"},r={onChange:function(){},retina:"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3e %3cg fill='none' fill-rule='evenodd'%3e %3ccircle id='a' cx='10' cy='10' r='10' fill='black' fill-opacity='.3' /%3e %3ccircle cx='10' cy='10' r='9' stroke='white' stroke-opacity='.8' stroke-width='2'/%3e %3c/g%3e%3c/svg%3e"},h=function(){function t(t,e){var s=this;void 0===e&&(e={}),this._enabled=!1,this.startDragging=function(t){t.preventDefault(),s.isDragging=!0,t instanceof MouseEvent?s.updateCoordinates(t.clientX,t.clientY):s.updateCoordinates(t.touches[0].clientX,t.touches[0].clientY)},this.handleMove=function(t){if(t.preventDefault(),t instanceof MouseEvent)s.updateCoordinates(t.clientX,t.clientY);else{var e=t.touches[0],i=document.elementFromPoint(e.pageX,e.pageY);i!==s.retina&&i!==s.img?s.stopDragging():s.updateCoordinates(e.clientX,e.clientY)}},this.stopDragging=function(){s.isDragging=!1},this.updateRetinaPositionFromFocus=function(){s.updateRetinaPosition(s.calculateOffsetFromFocus())},this.updateRetinaPosition=function(t){s.retina.style.top=t.offsetY+"px",s.retina.style.left=t.offsetX+"px"},this.options=i({},r,e),this.img=t,this.container=t.parentElement,this.img.draggable=!1,i(this.img.style,o),i(this.container.style,n),this.focus=this.getFocus(),this.enable()}var e,s=t.prototype;return s.getFocus=function(){return this.options.focus?this.options.focus:{x:parseFloat(this.img.getAttribute("data-focus-x"))||0,y:parseFloat(this.img.getAttribute("data-focus-y"))||0}},s.enable=function(){this._enabled||(this.retina=document.createElement("img"),this.retina.src=this.options.retina,this.retina.draggable=!1,this.container.appendChild(this.retina),i(this.retina.style,a),this.startListening(),this.setFocus(this.focus),this._enabled=!0)},s.disable=function(){this._enabled&&this.retina&&(this.stopListening(),this.container.removeChild(this.retina),this._enabled=!1)},s.startListening=function(){this.container.addEventListener("mousedown",this.startDragging),this.container.addEventListener("mousemove",this.handleMove),this.container.addEventListener("mouseup",this.stopDragging),this.container.addEventListener("mouseleave",this.stopDragging),this.container.addEventListener("touchend",this.stopDragging),this.container.addEventListener("touchstart",this.startDragging,{passive:!0}),this.container.addEventListener("touchmove",this.handleMove,{passive:!0}),this.img.addEventListener("load",this.updateRetinaPositionFromFocus)},s.stopListening=function(){this.container.removeEventListener("mousedown",this.startDragging),this.container.removeEventListener("mousemove",this.handleMove),this.container.removeEventListener("mouseup",this.stopDragging),this.container.removeEventListener("mouseleave",this.stopDragging),this.container.removeEventListener("touchend",this.stopDragging),this.container.removeEventListener("touchstart",this.startDragging),this.container.removeEventListener("touchmove",this.handleMove),this.img.removeEventListener("load",this.updateRetinaPositionFromFocus)},s.setFocus=function(t){this.focus=t,this.img.setAttribute("data-focus-x",t.x.toString()),this.img.setAttribute("data-focus-y",t.y.toString()),this.updateRetinaPositionFromFocus(),this.options.onChange(t)},s.calculateOffsetFromFocus=function(){var t=this.img.getBoundingClientRect();return{offsetX:t.width*(this.focus.x/2+.5),offsetY:t.height*(this.focus.y/-2+.5)}},s.updateCoordinates=function(t,e){if(this.isDragging){var i=this.img.getBoundingClientRect();this.setFocus({x:2*((t-i.left)/i.width-.5),y:-2*((e-i.top)/i.height-.5)})}},(e=[{key:"enabled",get:function(){return this._enabled}}])&&function(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}(t.prototype,e),t}(),c={minHeight:"100%",minWidth:"100%"},u={height:"100%",width:"100%",border:"none",opacity:0,zIndex:-1,pointerEvents:"none"},l={debounceTime:17,updateOnWindowResize:!0,updateOnContainerResize:!1,containerPosition:"relative"},d=function(){function t(t,e){var o,a,r,h=this;void 0===e&&(e={}),this.imageNode=t,this.listening=!1,this.setFocus=function(t){h.focus=t,h.img.setAttribute("data-focus-x",t.x.toString()),h.img.setAttribute("data-focus-y",t.y.toString()),h.applyShift()},this.applyShift=function(){var t=h.img,e=t.naturalWidth,i=t.naturalHeight,n=h.container.getBoundingClientRect(),s=n.width,o=n.height,a="0",r="0";if(!(s>0&&o>0&&e>0&&i>0))return!1;var c=e/s,u=i/o;h.img.style.maxHeight=null,h.img.style.maxWidth=null,e>s&&i>o&&(h.img.style[c>u?"maxHeight":"maxWidth"]="100%"),c>u?a=h.calcShift(u,s,e,h.focus.x)+"%":c<u&&(r=h.calcShift(c,o,i,h.focus.y,!0)+"%"),h.img.style.top=r,h.img.style.left=a},this.options=i(l,e),this.img=t,this.container=t.parentElement,this.img.__focused_image_instance__&&(this.img.__focused_image_instance__.stopListening(),this.img.removeEventListener("load",this.applyShift)),this.img.__focused_image_instance__=this,this.img.addEventListener("load",this.applyShift),i(this.container.style,n),this.container.style.position=this.options.containerPosition,i(this.img.style,c,s),this.debounceApplyShift=(o=this.applyShift,a=this.options.debounceTime,function(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];clearTimeout(r),r=setTimeout((function(){return o.apply(void 0,e)}),a)}),this.focus=this.options.focus?this.options.focus:{x:parseFloat(this.img.getAttribute("data-focus-x"))||0,y:parseFloat(this.img.getAttribute("data-focus-y"))||0},this.startListening(),this.setFocus(this.focus)}var e=t.prototype;return e.startListening=function(){var t=this;if(!this.listening&&(this.listening=!0,this.options.updateOnWindowResize&&window.addEventListener("resize",this.debounceApplyShift),this.options.updateOnContainerResize)){var e=document.createElement("object");i(e.style,u,s),e.addEventListener("load",(function(i){return e.contentDocument.defaultView.addEventListener("resize",(function(){return t.debounceApplyShift()}))})),e.type="text/html",e.setAttribute("aria-hidden","true"),e.tabIndex=-1,this.container.appendChild(e),e.data="about:blank",this.resizeListenerObject=e}},e.stopListening=function(){this.listening&&(this.listening=!1,window.removeEventListener("resize",this.debounceApplyShift),this.resizeListenerObject&&this.resizeListenerObject.contentDocument&&(this.resizeListenerObject.contentDocument.defaultView.removeEventListener("resize",this.debounceApplyShift),this.container.removeChild(this.resizeListenerObject),this.resizeListenerObject=null))},e.calcShift=function(t,e,i,n,s){var o=Math.floor(e/2),a=(n+1)/2,r=Math.floor(i/t),h=Math.floor(a*r);s&&(h=r-h);var c=h-o,u=r-h,l=e-o;return u<l&&(c-=l-u),c<0&&(c=0),-100*c/e},t}();e.FocusPicker=h,e.FocusedImage=d},3600:function(t,e,i){"use strict";t.exports=i(9099)}}]);