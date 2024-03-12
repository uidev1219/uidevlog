ACMS.Dispatch = function (context) {
  var Config = ACMS.Config
  var Dispatch = arguments.callee
  new ACMS.Dispatch.ModuleDialog('index')
  ACMS.Dispatch2(context)
  $(document).on('drop dragover', function (e) {
    if (e.target.type !== 'file') {
      e.stopPropagation()
      e.preventDefault()
    }
  })
  Dispatch.Utility(context)
  if (window != parent) {
    setTimeout(function () {
      Dispatch.Utility(context)
    }, 1e3)
  }
  Dispatch.unloadAlert(context)
  if (ACMS.Config.layout && !ACMS.Dispatch.Layout.load) {
    ACMS.Dispatch.Layout()
  }
  $(Config.swfoMark, context).each(function () {
    Dispatch.swfobject(this)
  })
  if (ACMS.Config.eid) {
    Dispatch.revisionIndex()
    Dispatch._revision()
  }
  ACMS.Dispatch.imageUnitAjaxUpload()
  $('a.updateTime', context).each(function () {
    Dispatch.updatetime(this)
  })
  $('a.updateDate', context).each(function () {
    Dispatch.updatedate(this)
  })
  $('#js-admin_action_box', context).each(function () {
    $('#adminBox', this).removeClass('js-dragAdminBox')
  })
  $(':not(#js-admin_action_box) .js-dragAdminBox', context).each(function () {
    var $status = $.cookie('acms_config_admin_box_display_status')
    var $box = $('.js-dragAdminBox.normalBox')
    var $minBox = $('.js-dragAdminBox.minBox')
    $(this).draggable({
      cursor: 'move',
      axis: 'x',
      containment: 'document',
      handle: '.dragBoxHandle',
      opacity: 0.7,
      drag: function (event, pr) {
        var $disp = 'show'
        if ($minBox.css('display') == 'block') $disp = 'hide'
        $.cookie(
          'acms_config_admin_box_display_status',
          $disp + ':' + pr.position.left,
          { path: '/' },
        )
      },
    })
    if ($status) {
      $status = $status.split(':')
      var $display = $status[0]
      var $itemLeft = $status[1]
      if ($display == 'hide') {
        $minBox.css('left', parseInt($itemLeft))
        $box.hide()
        $minBox.show()
      } else {
        $box.css('left', parseInt($itemLeft))
        $minBox.hide()
        $box.show()
      }
    } else {
      $minBox.hide()
      $box.show()
    }
  })
  $(':not(#js-admin_action_box) .js-dragAdminBox .dragBoxToggle', context).each(
    function () {
      $(this).click(function (event) {
        var $box = $('.js-dragAdminBox.normalBox')
        var $minBox = $('.js-dragAdminBox.minBox')
        var $status = 'show:10'
        if ($box.css('display') == 'block') {
          var $itemLeft = $box.position().left + $box.width() - $minBox.width()
          if ($itemLeft < 0) $itemLeft = 0
          $minBox.css('left', $itemLeft)
          $box.slideUp(200, function () {
            $minBox.slideDown(200)
          })
          $status = 'hide:' + $itemLeft
        } else {
          var $itemLeft =
            $minBox.position().left - ($box.width() - $minBox.width())
          if ($itemLeft < 0) $itemLeft = 0
          $box.css('left', $itemLeft)
          $minBox.slideUp(200, function () {
            $box.slideDown(200)
          })
          $status = 'show:' + $itemLeft
        }
        $.cookie('acms_config_admin_box_display_status', $status, { path: '/' })
      })
    },
  )
  $('.acms-admin-modal-show', context).each(function () {
    var target = $(this).data('target')
    var $target = $(context).find(target)
    if (!!$target.length) {
      $target.addClass('out')
      $(this).click(function () {
        Dispatch.modal($target)
        return true
      })
    }
  })
  ;(function () {
    var selector =
      'input.js-saving-splash[type="submit"], button.js-saving-splash[type="submit"]'
    $('.js-loading_splash')
      .closest('form')
      .on('submit', function () {
        var message = $('.js-loading_splash', this).data('msg')
        ACMS.Dispatch.splash(message)
        return true
      })
    $('form').on('submit', function () {
      $(selector, $(this)).each(function () {
        if ($(this).attr('data-clicked') === 'true') {
          ACMS.Dispatch.splash(ACMS.i18n('splash.save'))
          return
        }
      })
      return true
    })
    $(selector, context).on('click', function () {
      $(
        'input[type="submit"], button[type="submit"]',
        $(this).closest('form'),
      ).removeAttr('data-clicked')
      $(this).attr('data-clicked', 'true')
    })
  })()
  var $images = $(Config.ppMark, context),
    $caption
  if (
    $images.size() &&
    $(window).width() > Config.ppMinWindowSize &&
    (!Config.ppDisableMobile || !ACMS.Dispatch.Utility.browser().mobile) &&
    (!Config.ppDisableTablet || !ACMS.Dispatch.Utility.browser().tablet)
  ) {
    if (Config.ppCaption2Title) {
      $images.each(function () {
        $caption = $(this).parent().find('p.caption')
        if ($caption.size()) {
          $(this).attr('title', $caption.text())
        }
      })
    }
    $images.prettyPhoto(Config.ppConfig)
  } else if (Config.ppWindowTarget) {
    $images.attr('target', Config.ppWindowTarget)
  }
  var $smartimages = $(Config.SmartPhotoMark, context)
  if ($smartimages.size()) {
    ACMS.Library.SmartPhoto($smartimages.get())
  }
  var $modalvideos = $(Config.modalVideoMark, context)
  if ($modalvideos.size()) {
    ACMS.Library.modalVideo($modalvideos.get())
  }
  if (
    $('pre').size() &&
    typeof ACMS.Library.googleCodePrettify === 'function'
  ) {
    ACMS.Library.googleCodePrettify()
  }
  var $aImg = $(Config.adaptiveImageMark)
  if ($aImg.size()) {
    var resolved = false,
      $window = $(window)
    $aImg = $aImg.filter(function () {
      var $self = $(this),
        nowWidth = ~~$self.attr('width'),
        baseWidth = ~~$self.attr('data-width'),
        src = $self.attr('src')
      return !(nowWidth >= baseWidth) && src.indexOf('tiny-') !== -1
    })
    $window
      .resize(function () {
        if (!resolved && $window.width() > Config.adaptiveImageSize) {
          resolved = true
          $aImg.each(function (i) {
            var $self = $(this),
              width = ~~$self.attr('data-width'),
              height = ~~$self.attr('data-height'),
              src = $self.attr('src'),
              $div = $self.closest('div')
            if ($div.get(0).className.indexOf('column-image-') !== -1) {
              $div.css('width', width)
            }
            $self.attr({
              width: width,
              height: height,
              src: src.replace('tiny-', ''),
            })
          })
        }
      })
      .resize()
  }
  $(Config.popupSettingMark, context).each(function () {
    $(this)
      .parent('.acms-admin-module-edit')
      .show()
      .parent()
      .addClass('acms-admin-module-edit-wrapper')
    var $conf = Config.popupSettingConf
    $(this).bind('click', function () {
      window.open(
        this.href,
        'popup_setting',
        'width=' +
          $conf.width +
          ', height=' +
          $conf.height +
          ', status=no, scrollbars=yes',
      )
      return false
    })
  })
  $(Config.moduleManagementMark, context).each(function () {
    $(this)
      .parent('.acms-admin-module-edit')
      .parent()
      .addClass('acms-admin-module-edit-wrapper')
    $(this).bind('click', function () {
      var mid = $(this).data('mid'),
        bid = $(this).data('bid'),
        edit = isFinite(mid) ? 'update' : 'insert'
      var Dialog = new ACMS.Dispatch.ModuleDialog(edit)
      Dialog.show(mid, '', bid)
      return false
    })
  })
  $(Config.dialogBtnMark, context).each(function () {
    ACMS.Dispatch.Dialog(this)
  })
  var $moduleForm = $('#js-module_form')
  $('.js-module_form_trigger')
    .unbind()
    .bind('click', function () {
      $moduleForm.submit()
      return false
    })
  $moduleForm.bind('submit', function () {
    var $form = $(this),
      $modalBody = $form.closest('.acms-admin-modal-body'),
      $modal = $modalBody.closest('#js-module_management'),
      $iframe = $('iframe[name="js-ajaxPostData"]')
    $iframe.unbind().bind('load', function () {
      var res = $iframe.contents(),
        $res = $('.acms-admin-modal-body', res)
      $modalBody.html($res.html())
      Dispatch($modal)
      $form[0].reset()
      if (
        !$('.acms-admin-alert.acms-admin-alert-danger').length &&
        !Config.layout
      ) {
        if (confirm(Config.moduleManagementReloadMsg)) {
          window.location.reload()
        }
      }
    })
  })
  $.each(
    Config.hsArray.concat({ mark: Config.hsMark, config: Config.hsConfig }),
    function () {
      Config.hsConfig = this.config
      $(this.mark, context).each(function () {
        Dispatch.highslide(this)
      })
    },
  )
  $.each(
    Config.biggerlinkArray.concat({
      mark: Config.biggerlinkMark,
      conf: Config.biggerlinkConf,
    }),
    function () {
      Config.biggerlinkConf = this.conf
      $(this.mark, context).each(function () {
        Dispatch.biggerlink(this)
      })
    },
  )
  $.each(
    Config.bxsliderArray.concat({
      mark: Config.bxsliderMark,
      conf: Config.bxsliderConf,
    }),
    function () {
      Config.bxsliderConf = this.conf
      $(this.mark, context).each(function () {
        Dispatch.bxslider(this)
      })
    },
  )
  ACMS.Loaded(function () {
    $.each(
      Config.autoHeightConfArray.concat({ mark: Config.autoHeightMark }),
      function () {
        $(this.mark, context).each(function () {
          Dispatch.autoheight()
        })
      },
    )
  })
  ACMS.Loaded(function () {
    $.each(
      Config.autoHeightRArray.concat({
        mark: Config.autoHeightRMark,
        config: Config.autoHeightRConf,
      }),
      function () {
        this.config.mark = this.mark
        Config.autoHeightRConf = this.config
        Dispatch.autoheightR()
      },
    )
  })
  $(Config.fieldgroupSortableMark, context).each(function () {
    Dispatch.fieldgroupSortable(this)
  })
  $.each(
    Config.dpicArray.concat({
      mark: Config.dpicMark,
      config: Config.dpicConfig,
    }),
    function () {
      Config.dpicConfig = this.config
      $(this.mark, context).each(function () {
        Dispatch.datepicker(this)
      })
    },
  )
  $.each(
    Config.accordionArray.concat({
      mark: Config.accordionMark,
      config: Config.accordionConfig,
    }),
    function () {
      Config.accordionConfig = this.config
      $(this.mark, context).each(function () {
        Dispatch.accordion(this)
      })
    },
  )
  $.each(
    Config.tabsArray.concat({
      mark: Config.tabsMark,
      config: Config.tabsConfig,
    }),
    function () {
      Config.tabsConfig = this.config
      $(this.mark, context).each(function () {
        Dispatch.tabs(this)
      })
    },
  )
  if (location.href.indexOf('admin/customfield_maker') === -1) {
    $.each(
      Config.acmsTabsArray.concat({
        mark: Config.acmsTabsMark,
        config: Config.acmsTabsConfig,
      }),
      function () {
        Config.acmsTabsConfig = this.config
        $(this.mark, context).each(function () {
          Dispatch.acmsTabs(this)
        })
      },
    )
  }
  $(Config.acmsAlertCloseMark, context).each(function () {
    Dispatch.acmsAlertClose(this)
  })
  $.each(
    Config.acmsAlertCloseArray.concat({
      mark: Config.acmsAlertCloseMark,
      config: Config.acmsAlertCloseConfig,
    }),
    function () {
      Config.acmsAlertCloseConfig = this.config
      $(this.mark, context).each(function () {
        Dispatch.acmsAlertClose(this)
      })
    },
  )
  $.each(
    Config.faderArray.concat({
      mark: Config.faderMark,
      config: Config.faderConfig,
    }),
    function () {
      Config.faderConfig = this.config
      $(this.mark, context).each(function () {
        Dispatch.fader(this)
      })
    },
  )
  ACMS.addListener('acmsAddUnit', function (event) {
    $.each(
      Config.faderArray.concat({
        mark: Config.faderMark,
        config: Config.faderConfig,
      }),
      function () {
        Config.faderConfig = this.config
        $(this.mark, event.obj.item).each(function () {
          Dispatch.fader(this)
        })
      },
    )
  })
  $.each(
    Config.toggleArray.concat({
      mark: Config.toggleMark,
      config: Config.toggleConfig,
    }),
    function () {
      Config.toggleConfig = this.config
      $(this.mark, context).each(function () {
        Dispatch.toggle(this)
      })
    },
  )
  if (
    1 &&
    ACMS.Config.webStorage === 'on' &&
    typeof localStorage !== 'undefined'
  ) {
    var key = ACMS.Config.delStorage
    if (key) {
      if (ACMS.Config.webStorageCapacity === 'limitless') {
        if (ACMS.Config.webStorageType === 'session') {
          sessionStorage.removeItem(key)
        } else if (ACMS.Config.webStorageType === 'local') {
          localStorage.removeItem(key)
        } else {
          sessionStorage.clear()
          localStorage.clear()
        }
      }
    }
  }
  Dispatch.Postinclude(context)
  Dispatch.Linkmatchlocation(context)
  $(Config.validatorFormMark, context).each(function () {
    Dispatch.validator(this)
  })
  $(Config.rolloverImgMark, context).each(function () {
    Dispatch.rollover(this)
  })
  $(Config.scrollToMark, context).each(function () {
    Dispatch.scrollto(this)
  })
  $(Config.select2textMark, context).each(function () {
    Dispatch.select2text(this)
  })
  $(Config.zebraMark, context).each(function () {
    Dispatch.zebra(this)
  })
  $(Config.placeholderMark, context).each(function () {
    Dispatch.placeholder(this)
  })
  if (!('placeholder' in document.createElement('input'))) {
    $('[placeholder]', context).each(function () {
      Dispatch.crossBrowserPlaceholder(this)
    })
  }
  $(Config.incrementalSearchMark, context).each(function () {
    Dispatch.incrementalSearch(this)
  })
  $(Config.hoverMark, context).each(function () {
    Dispatch.hover(this)
  })
  $(Config.clickSelectionInputTextMark, context).each(function () {
    Dispatch.selection(this)
  })
  $(Config.countupMark, context).each(function () {
    Dispatch.countup(this)
  })
  $(Config.externalFormButtonMark, context).each(function () {
    Dispatch.ExternalSubmit(this)
  })
  var $viewing = $(
    "a[href='" + encodeURI(document.location.href) + "']",
    context,
  )
  if ($viewing.size()) {
    $viewing.filter(Config.viewingMark).each(function () {
      if ($(this).attr('id')) {
        return true
      }
      if ($(this).parent().attr('id')) {
        return true
      }
      $(this).parent().attr('id', Config.viewingId)
      $(this).parent().addClass(Config.viewingClass)
    })
    $viewing.filter(Config.viewingEraseMark).each(function () {
      var display = $(this).css('display')
      if (
        Config.viewingNonTarget.some(function (v) {
          return v === display
        })
      ) {
        return true
      }
      var html = $(this).html()
      var replacement = Config.viewingReplacement
      var attrs = {}
      var removeAttrs = Config.viewingRemoveAttr
      if (replacement) {
        $.each($(this)[0].attributes, function (idx, attr) {
          for (var i = 0, length = removeAttrs.length; i < length; i++) {
            if (attr.nodeName === removeAttrs[i]) {
              return
            }
          }
          attrs[attr.nodeName] = attr.nodeValue
        })
        $(this).replaceWith(function () {
          return $('<' + replacement + '/>', attrs).append(html)
        })
      } else {
        $(this).after(html)
      }
      $(this).remove()
    })
  }
  var innerlinkPtn = new RegExp(
    '(' + Config.domains.replace(/,/g, '|') + ')(:\\d+)*',
  )
  $(Config.linkOutsideBlankMark, context).each(function () {
    if (innerlinkPtn.exec(ACMS.Library.punycodeEncode(this.href))) {
      return true
    }
    $(this).attr('target', '_blank')
    if (Config.linkOutsideAppendAttr) {
      $(this).attr('rel', Config.linkOutsideAppendAttr)
    }
  })
  if (
    1 &&
    'https:' == document.location.protocol &&
    Config.fulltimeSSL != '1' &&
    !location.href.match(/admin\/(.*)$/)
  ) {
    $(Config.linkHttpsDisablerMark, context)
      .not(Config.linkHttpsNoRewriteMark)
      .each(function () {
        var href = $(this).attr('href')
        if (
          !!href &&
          !href.match(/https?:\/\//) &&
          !$(this).attr('href').match(/^#/)
        ) {
          this.href = this.href.replace(/https:\/\//, 'http://')
        }
      })
  } else {
    $(Config.linkHttpsEnablerMark, context)
      .not(Config.linkHttpsNoRewriteMark)
      .each(function () {
        var href = $(this).attr('href')
        if (!!href && !href.match(/https?:\/\//) && !href.match(/^#(.*)$/)) {
          this.href = this.href.replace(/http:\/\//, 'https://')
        }
      })
  }
  $('.selectLink', context)
    .change(function () {
      var url = $(':selected', this).val(),
        admin
      if (url !== '' && url.indexOf('http') === 0) {
        if (location.href.match(/admin\/(.*)$/)) {
          admin = RegExp.$1
          if (admin.match(/^[a-z]+_edit\//)) {
            admin = admin.replace(/^([a-z]+)_(edit\/.*)$/, '$1_index')
          }
          url = url.replace(/admin\/.*$/, 'admin/' + admin)
        }
        location.href = url
      }
    })
    .show()
  if (ACMS.Config.resizeImage !== 'on') {
    $(Config.observeFileSizeMark, context).each(function () {
      Dispatch._observefilesize(this)
    })
  }
  if (Config.admin || $('#js-module_management').length) {
    if (
      $(
        ':input[name^="ACMS_POST_Entry_Insert"], :input[name^="ACMS_POST_Entry_Update"], :input[name^="ACMS_POST_Form2_Update"], :input[name^="ACMS_POST_Entry_Add"]',
        context,
      ).size()
    ) {
      Dispatch.Edit(context)
      if (Config.admin === 'entry_editor') Dispatch.Admin(context)
    } else {
      Dispatch.Admin(context)
    }
  }
  if ($('.js-edit_inplace', context).length) {
    ACMS.Load.Dispatch.Edit._inplace(function () {
      Dispatch.Edit(context)
    })
  }
  if ($('.js-direct-unit', context).length) {
    $('.js-direct-unit', context).unbind('click')
    $('.js-direct-unit', context).click(function () {
      ACMS.Dispatch.Edit(context)
      ACMS.Dispatch.Edit._direct(this)
      return false
    })
  }
  if ($(Config.offcanvas.offcanvasMark).length > 0) {
    Dispatch.offcanvas(context)
  }
  if ($(Config.prettyScrollMark, context).length > 0) {
    Dispatch.prettyScroll($(Config.prettyScrollMark, context).get(0))
  }
  if ($(Config.googleTranslateMark, context).length > 0) {
    $(Config.googleTranslateMark, context).click(function () {
      var $dest = $($(this).data('target'))
      var query = {
        target_language: $(this).data('lang'),
        text: $($(this).data('source')).val(),
        cache: new Date().getTime(),
      }
      var url = ACMS.Library.acmsLink(
        { tpl: '/ajax/google-translate.json', bid: ACMS.BID, Query: query },
        false,
      )
      $.getJSON(url, function (res) {
        if (res && res[0] && res[0].translatedText) {
          var result = res[0].translatedText
          $dest.val(ACMS.Library.decodeEntities(result))
        }
      })
    })
  }
  ACMS.dispatchEvent('acmsDispatch')
}
ACMS.Dispatch.unloadAlert = function (context) {
  ACMS.Dispatch.Utility.unloadAlert(context, ACMS.Config.unloadAlertMark)
}
ACMS.Dispatch.Linkmatchlocation = function (context) {
  var Config = ACMS.Config
  var Linkmatchlocation = arguments.callee
  $.each(
    Config.linkMatchLocationArray.concat(
      {
        mark: Config.linkMatchLocationMark,
        type: 'part',
        class: Config.linkMatchLocationClass,
      },
      {
        mark: Config.linkMatchLocationFullMark,
        type: 'full',
        class: Config.linkMatchLocationFullClass,
      },
      {
        mark: Config.linkMatchLocationContainMark,
        type: 'contain',
        class: Config.linkMatchLocationContainClass,
      },
      {
        mark: Config.linkMatchLocationBlogMark,
        type: 'blog',
        class: Config.linkMatchLocationBlogClass,
      },
      {
        mark: Config.linkMatchLocationCategoryMark,
        type: 'category',
        class: Config.linkMatchLocationCategoryClass,
      },
      {
        mark: Config.linkMatchLocationEntryMark,
        type: 'entry',
        class: Config.linkMatchLocationEntryClass,
      },
    ),
    function () {
      var mark = this.mark
      var type = this.type
      var className = this.class
      $(mark, context).each(function () {
        Linkmatchlocation[type](this, className)
      })
    },
  )
}
ACMS.Dispatch.Postinclude = function (context) {
  var Config = ACMS.Config
  var Postinclude = arguments.callee
  $.each(
    Config.postIncludeArray.concat(
      {
        mark: Config.postIncludeOnsubmitMark,
        type: 'submit',
        method: Config.postIncludeMethod,
        effect: Config.postIncludeEffect,
        effectSpeed: Config.postIncludeEffectSpeed,
      },
      {
        mark: Config.postIncludeOnreadyMark,
        type: 'ready',
        method: Config.postIncludeMethod,
        effect: Config.postIncludeEffect,
        effectSpeed: Config.postIncludeEffectSpeed,
        delay: Config.postIncludeReadyDelay,
      },
      {
        mark: Config.postIncludeOnBottomMark,
        type: 'bottom',
        method: Config.postIncludeMethod,
        effect: Config.postIncludeEffect,
        effectSpeed: Config.postIncludeEffectSpeed,
        offset: Config.postIncludeOffset,
      },
      {
        mark: Config.postIncludeOnIntervalMark,
        type: 'interval',
        method: Config.postIncludeMethod,
        effect: Config.postIncludeEffect,
        effectSpeed: Config.postIncludeEffectSpeed,
        interval: Config.postIncludeIntervalTime,
      },
    ),
    function () {
      var setting = this
      $(this.mark, context).each(function () {
        Postinclude[setting.type](this, setting)
      })
    },
  )
}
ACMS.Dispatch.ExternalSubmit = function (elm) {
  var form = elm
  if ('undefined' != typeof form.returnValue) {
    if (!form.returnValue) {
      return false
    }
  }
  var target = form
  if (form.target) {
    var $target = $(form.target)
    if (!$target.size()) {
      return false
    }
    target = $target[0]
  }
  if ($(target).size()) {
    form.target = '_self'
    $(target).click(function () {
      form.submit()
    })
  } else {
    return false
  }
}
ACMS.Dispatch.scrollto = function (elm) {
  $(elm).click(function () {
    var hash = elm.hash.slice(1),
      $target
    var offset = $(elm).data('offset')
    var $setting = {}
    if (!(typeof offset != 'number' && typeof offset != 'string')) {
      $setting = { offset: offset }
    }
    if (!!hash) {
      $target = $('[name="' + hash + '"]' + ', ' + '#' + hash)
      ACMS.Library.scrollToElm($target, $setting)
    } else {
      ACMS.Library.scrollToElm(null, $setting)
    }
    return false
  })
}
ACMS.Dispatch.splash = function (message) {
  if ($('#js-loading_splash').length) {
    return false
  }
  if (!message) {
    message = ACMS.i18n('splash.default')
  }
  var $body = $('body'),
    $img = ($img = $(
      $.parseHTML(
        '<div class="js-acms_loader_img js-acms_loader" style="display:none;"></div>',
      ),
    )),
    $prog = $($.parseHTML('<div id="js-loading_splash"></div>')),
    $progOuter = $(
      $.parseHTML(
        '<div class="js-loading_splash_frame"><p>' + message + '</p></div>',
      ),
    )
  $prog.append($progOuter)
  if (ACMS.Dispatch.Utility.browser().ltIE9) {
    $img = $(
      $.parseHTML(
        '<img class="js-acms_loader_img" src="' +
          ACMS.Config.root +
          'themes/system/images/ajax-loader.gif" style="display:none;"/>',
      ),
    )
  }
  $prog.css({
    top: document.body.scrollTop || document.documentElement.scrollTop,
    left: document.body.scrollLeft || document.documentElement.scrollLeft,
    height: window.innerHeight,
    'z-index': 2147483647,
  })
  $img.appendTo($progOuter).show()
  $body.append($prog)
  $prog.fadeIn(100)
}
ACMS.Dispatch.removeSplash = function () {
  $('#js-loading_splash')
    .fadeOut(500)
    .queue(function () {
      $(this).remove()
    })
}
ACMS.Dispatch.biggerlink = function (elm) {
  ;(function (conf) {
    $(elm).biggerlink(conf)
  })(ACMS.Config.biggerlinkConf)
}
ACMS.Dispatch.bxslider = function (elm) {
  ;(function (conf) {
    $(elm).bxSlider(conf)
    $(elm).show()
  })(ACMS.Config.bxsliderConf)
}
ACMS.Dispatch.autoheight = function () {
  $(ACMS.Config.autoHeightConfArray).each(function () {
    for (var i in this) {
      $(ACMS.Config.autoHeightMark + ' ' + i).autoheight({
        column: this[i],
        clear: 1,
      })
    }
  })
}
ACMS.Dispatch.autoheightR = function () {
  ;(function (conf) {
    var timer = false,
      offset = conf.offset,
      style = conf.style === 'height' ? 'height' : 'min-height',
      parent = conf.parent,
      element = conf.element,
      list = conf.list,
      mark = conf.mark
    $(window)
      .resize(function () {
        if (timer !== false) {
          clearTimeout(timer)
        }
        timer = setTimeout(function () {
          var $boxAry = $(mark),
            currentWidth = 0,
            maxHeight = 0,
            rowAry = []
          if (element.length > 0) {
            $(element).css(style, 'auto')
          } else {
            $boxAry.css(style, 'auto')
          }
          _.each($boxAry, function (v) {
            var $box = $(v),
              $next = $box.next(),
              boxWidth = $box.outerWidth(true),
              tmpHeight = $box.outerHeight(),
              containerWidth =
                parent === 'parent'
                  ? $box.parent().width()
                  : $box.closest(parent).width()
            if (!!list) {
              $next = $box.parent(list).next().find(mark)
            }
            if (
              1 &&
              rowAry.length > 0 &&
              containerWidth - (currentWidth + boxWidth) < -5
            ) {
              _.each(rowAry, function (box) {
                if (element.length > 0) {
                  $(element, box).css(style, maxHeight + offset)
                } else {
                  $(box).css(style, maxHeight + offset)
                }
              })
              currentWidth = 0
              maxHeight = 0
              rowAry = []
            }
            rowAry.push($box)
            currentWidth += boxWidth
            if (tmpHeight > maxHeight) {
              maxHeight = tmpHeight
            }
            if (!$next.hasClass(mark.substring(1))) {
              _.each(rowAry, function (box) {
                if (element.length > 0) {
                  $(element, box).css(style, maxHeight + offset)
                } else {
                  $(box).css(style, maxHeight + offset)
                }
              })
              currentWidth = 0
              maxHeight = 0
              rowAry = []
            }
          })
        }, 200)
      })
      .trigger('resize')
  })(ACMS.Config.autoHeightRConf)
}
ACMS.Dispatch.datepicker = function (elm) {
  ;(function (config) {
    $(elm).datepicker(config)
  })(ACMS.Config.dpicConfig)
}
ACMS.Dispatch.accordion = function (elm) {
  ;(function (config) {
    $(elm).accordion(config)
  })(ACMS.Config.accordionConfig)
}
ACMS.Dispatch.tabs = function (elm) {
  ;(function (config) {
    $(elm).tabs(config)
  })(ACMS.Config.tabsConfig)
}
ACMS.Dispatch.acmsTabs = function (elm) {
  ;(function (config) {
    var $tabs = $()
    var $panels = $()
    var $expr = $("a[href^='#']", elm)
    $expr.each(function () {
      var panel = $(this).attr('href')
      $tabs = $tabs.add(this)
      $panels = $panels.add($(panel))
      $(this).addClass(config.tabClass)
      $(this).click(function () {
        $tabs.removeClass(config.activeClass)
        $(this).addClass(config.activeClass)
        $panels.hide()
        $(panel).show()
        return false
      })
    })
    $panels.hide()
    $expr.filter(':first').click()
    if (config.readyMark != '' && 'undefined' != typeof config.readyMark) {
      if (config.readyMark.substr(0, 1) === '#') {
        $expr.filter("a[href='" + config.readyMark + "']").click()
      }
      $expr.filter(config.readyMark).click()
    }
  })(ACMS.Config.acmsTabsConfig)
}
ACMS.Dispatch.acmsAlertClose = function (elm) {
  ;(function (config) {
    $(elm).click(function () {
      var $alert = $(this).parent(config.target)
      $alert.remove()
    })
  })(ACMS.Config.acmsAlertCloseConfig)
}
ACMS.Dispatch.fader = function (elm) {
  ;(function (config) {
    var $head = $(elm)
    var $body = $(elm.href.replace(/^[^#]+/, ''))
    if ($head.hasClass('js-fade-active')) {
      return
    }
    $head.addClass('js-fade-active')
    if ('hide' == config.initial) {
      $body.not(config.readyMark).hide()
      if ('none' != $body.css('display')) {
        $head.addClass(config.activeClass)
      }
    } else if ('show' == config.initial) {
      $body.show()
    }
    $head.click(function (event) {
      if ('slide' == config.effect) {
        if ('none' == $body.css('display')) {
          $head.addClass(config.activeClass)
          $body.slideDown(config.speed)
          localStorage.setItem('fader-storage' + $head.attr('href'), 'open')
        } else {
          $head.removeClass(config.activeClass)
          $body.slideUp(config.speed)
          localStorage.setItem('fader-storage' + $head.attr('href'), 'close')
        }
      } else if ('fade' == config.effect) {
        if ('none' == $body.css('display')) {
          $body.fadeIn(config.speed)
          $head.addClass(config.activeClass)
          localStorage.setItem('fader-storage' + $head.attr('href'), 'open')
        } else {
          $body.fadeOut(config.speed)
          $head.removeClass(config.activeClass)
          localStorage.setItem('fader-storage' + $head.attr('href'), 'close')
        }
      }
      event.preventDefault()
    })
    if ($head.hasClass(ACMS.Config.faderStorageMark.slice(1))) {
      var storage = localStorage.getItem('fader-storage' + $head.attr('href'))
      if (storage === 'open') {
        $head.click()
      }
    }
  })(ACMS.Config.faderConfig)
}
ACMS.Dispatch.toggle = function (elm) {
  ;(function (config) {
    var $head = $(elm).find(config.toggleHead)
    var $ready = $(elm).find(config.readyMark)
    var $hide = $(elm).find(config.hideMark)
    $ready.show()
    $hide.hide()
    $head.click(function () {
      if ($ready.css('display') == 'none') {
        $hide.fadeOut(config.speed, function () {
          $ready.fadeIn(config.speed)
        })
      } else {
        $ready.fadeOut(config.speed, function () {
          $hide.fadeIn(config.speed)
        })
      }
      return false
    })
  })(ACMS.Config.toggleConfig)
}
ACMS.Dispatch.swfobject = function (elm) {
  if (!$('dl.flashvars, dl.params, dl.attributes, dl.embed', elm).size())
    return true
  var flashvars = ACMS.Library.dl2object($('dl.flashvars', elm))
  var params = ACMS.Library.dl2object($('dl.params', elm))
  var attributes = ACMS.Library.dl2object($('dl.attributes', elm))
  var embed = ACMS.Library.dl2object($('dl.embed', elm))
  swfobject.embedSWF(
    embed.swfUrlStr,
    $(elm).attr('id'),
    embed.widthStr,
    embed.heightStr,
    embed.swfVersionStr,
    ACMS.Config.jsRoot + 'swfobject/expressInstall.swf',
    flashvars,
    params,
    attributes,
  )
}
ACMS.Dispatch.revisionIndex = function (context) {
  $('.js-get_revisions')
    .unbind()
    .bind('click', function () {
      var $revisionBox = $('#js-revision_index')
      var $backdrop = $('.acms-admin-modal-backdrop')
      var eid = ACMS.Config.eid
      ACMS.Dispatch.splash()
      if (!$backdrop.length) {
        $backdrop = $(
          $.parseHTML('<div class="acms-admin-modal-backdrop"></div>'),
        )
          .hide()
          .appendTo('body')
      }
      var code =
        '            <div id="js-edit_inplace-detail" class="acms-admin-modal out">                <div class="acms-admin-modal-dialog large">                    <div class="acms-admin-modal-content">                        <div class="acms-admin-modal-header">                            <i class="acms-admin-modal-hide acms-admin-icon-delete"></i>                            <h3>バージョン一覧</h3>                        </div>                        <div class="acms-admin-modal-body">                            <div class="acms-admin-padding-small"></div>                        </div>                    </div>                </div>            </div>'
      if (!$revisionBox.length) {
        $revisionBox = $($.parseHTML(code)).appendTo('body')
      } else {
        $revisionBox.empty().remove()
        $revisionBox = $($.parseHTML(code)).appendTo('body')
      }
      var query = { hash: Math.random().toString() }
      if (!!ACMS.Config.aid) {
        query.aid = ACMS.Config.aid
      }
      $.ajax({
        type: 'GET',
        url: ACMS.Library.acmsLink(
          { eid: eid, tpl: 'ajax/revision-index.html', Query: query },
          true,
        ),
        dataType: 'html',
        success: function (res) {
          ACMS.Dispatch.removeSplash()
          $raw = $($.parseHTML(res))
          if ($revisionBox.length) {
            $('body').css('overflow', 'hidden')
            $revisionBox
              .find('.acms-admin-modal-body > .acms-admin-padding-small')
              .append($raw)
            $revisionBox.show()
            $backdrop.show()
            setTimeout(function () {
              $revisionBox
                .removeClass('out')
                .delay(200)
                .queue(function () {
                  $(this)
                    .addClass('in')
                    .delay(500)
                    .queue(function () {
                      $(this).addClass('display').removeClass('in')
                    })
                    .dequeue()
                })
            }, 1)
          }
          ACMS.Config.postIncludeEffect = 'fade'
          ACMS.Dispatch($revisionBox)
          var closeFn = function () {
            $('body').css('overflow', '')
            $backdrop.fadeOut()
            $revisionBox.removeClass('display').addClass('out')
            setTimeout(function () {
              $revisionBox.hide()
            }, 500)
            return false
          }
          $('.acms-admin-modal-hide').bind('click', closeFn)
          $revisionBox.click(function (event) {
            var click = event.target
            if ($(click).hasClass('acms-admin-modal')) {
              closeFn()
            }
          })
        },
      })
    })
}
ACMS.Dispatch.modal = function ($modal) {
  var $backdrop = $('.acms-admin-modal-backdrop')
  var $hideBtn = $('.acms-admin-modal-hide')
  if (!$backdrop.length) {
    $backdrop = $($.parseHTML('<div class="acms-admin-modal-backdrop"></div>'))
      .hide()
      .appendTo('body')
  }
  $('body').css('overflow', 'hidden')
  $modal.show()
  $backdrop.show()
  setTimeout(function () {
    $modal
      .removeClass('out')
      .delay(200)
      .queue(function () {
        $(this)
          .addClass('in')
          .delay(500)
          .queue(function () {
            $(this).addClass('display').removeClass('in')
          })
          .dequeue()
      })
  }, 1)
  var closeFn = function () {
    $('body').css('overflow', '')
    $modal.removeClass('display').addClass('out')
    $backdrop.fadeOut()
    setTimeout(function () {
      $modal.hide()
    }, 500)
  }
  $hideBtn.click(closeFn)
  $modal.click(function (event) {
    var click = event.target
    if ($(click).hasClass('acms-admin-modal')) {
      closeFn()
    }
  })
}
ACMS.Dispatch.showModuleDialog = function (type, mid, $indexTpl, callback) {
  var query = { edit: type, mid: mid },
    tpl
  if (type == 'insert') {
    tpl = 'ajax/module/edit.html'
  } else if (type === 'index') {
    tpl = 'ajax/module/list.html'
    query = { edit: type, mid: mid, tpl: $indexTpl }
  } else if (type === 'update') {
    tpl = 'ajax/module/edit.html'
  }
  $.ajax({
    type: 'GET',
    url: ACMS.Library.acmsLink({ tpl: tpl, Query: query }, true),
    dataType: 'html',
    success: function (res) {
      var $modalBox = $($.parseHTML(res)).appendTo('body'),
        $backdrop = $(
          $.parseHTML('<div class="acms-admin-modal-backdrop"></div>'),
        )
          .hide()
          .appendTo('body')
      if ($modalBox.length) {
        $('body').css('overflow', 'hidden')
        setTimeout(function () {
          $backdrop.show()
          $modalBox.show()
          $modalBox.removeClass('out').addClass('in')
        }, 200)
        ACMS.Dispatch($modalBox)
      }
      $('.acms-admin-modal-hide').bind('click', function () {
        closeFn($modalBox, $backdrop)
      })
      $modalBox.click(function (event) {
        var click = event.target
        if ($(click).hasClass('acms-admin-modal')) {
          closeFn($modalBox, $backdrop)
        }
      })
      $('.js-layout_select_module_id').bind(
        'click',
        { modal: $modalBox, backdrop: $backdrop },
        selectModule,
      )
      $('.js-acms_layout_edit_module, .js-acms_layout_create_module')
        .unbind('click')
        .bind('click', { modal: $modalBox }, editModule)
    },
  })
  var selectModule = function (event) {
    var mid = $(this).data('mid')
    var tpl = $(this).closest('tr').find('[name^=template]').val()
    $.ajax({
      type: 'GET',
      url: ACMS.Library.acmsLink(
        {
          tpl: 'ajax/module/view.html',
          Query: { mid: mid, tpl: tpl, layout: 'edit' },
        },
        true,
      ),
      dataType: 'html',
      success: function (res) {
        callback(res, mid, tpl)
      },
      complete: function () {
        if (event.data) {
          closeFn(event.data.modal, event.data.backdrop)
        } else {
          closeFn($indexTpl, $('.acms-admin-modal-backdrop'))
        }
      },
    })
  }
  var editModule = function (event) {
    var mid = $(this).data('mid'),
      edit = isFinite(mid) ? 'update' : 'insert'
    ACMS.Dispatch.showModuleDialog(edit, mid, event.data.modal, callback)
  }
  var closeFn = function ($modalBox, $backdrop) {
    var getMid = isFinite($('.getMid').val()) ? $('.getMid').val() : mid
    var query = { mid: getMid }
    if ($indexTpl) {
      $.ajax({
        type: 'GET',
        url: ACMS.Library.acmsLink(
          { tpl: 'ajax/module/list.html', Query: query },
          true,
        ),
        dataType: 'html',
        success: function (res) {
          var $table = $indexTpl.find('.js-module_index_table'),
            $res = $(res).find('.js-module_index_table')
          $table.html($res.html())
          ACMS.Dispatch($indexTpl)
          $('.js-layout_select_module_id').bind('click', selectModule)
          $('.js-acms_layout_edit_module, .js-acms_layout_create_module')
            .unbind('click')
            .bind('click', { modal: $indexTpl }, editModule)
        },
      })
    }
    $('body').css('overflow', '')
    window.location.hash = ''
    $backdrop.fadeOut(150, function () {
      $backdrop.remove()
    })
    $modalBox.removeClass('in').addClass('out')
    setTimeout(function () {
      $modalBox.remove()
    }, 500)
    return false
  }
}
ACMS.Dispatch.updatedate = function (elm) {
  $(elm).click(function (e) {
    e.preventDefault()
    var $target = $('#' + $(elm).attr('rel'))
    $target.val(date())
    if ($target.get(0)) {
      ACMS.Library.triggerEvent($target.get(0), 'change')
    }
  })
  function date() {
    var D = new Date()
    var Y = D.getFullYear().toString()
    var m = (D.getMonth() + 1).toString()
    var d = D.getDate().toString()
    if (1 >= m.length) m = '0' + m
    if (1 >= d.length) d = '0' + d
    return Y + '-' + m + '-' + d
  }
}
ACMS.Dispatch.updatetime = function (elm) {
  $(elm).click(function (e) {
    e.preventDefault()
    var $target = $('#' + $(elm).attr('rel'))
    $target.val(time())
    if ($target.get(0)) {
      ACMS.Library.triggerEvent($target.get(0), 'change')
    }
  })
  function time() {
    var d = new Date()
    var h = d.getHours().toString()
    var m = d.getMinutes().toString()
    var s = d.getSeconds().toString()
    if (1 >= h.length) h = '0' + h
    if (1 >= m.length) m = '0' + m
    if (1 >= s.length) s = '0' + s
    return h + ':' + m + ':' + s
  }
}
ACMS.Dispatch.rollover = function (elm) {
  $(elm).each(function () {
    var s = elm.src
    var i = s.lastIndexOf('.')
    if (0 > i) i = s.length
    var o = s.substring(0, i) + ACMS.Config.rolloverImgSuffix + s.substring(i)
    new Image().src = o
    elm.s = s
    elm.o = o
    $(elm).hover(
      function () {
        this.src = this.o
      },
      function () {
        this.src = this.s
      },
    )
  })
}
ACMS.Dispatch.static2dynamic = function (elm) {
  function s2dMap() {
    ACMS.Library.googleLoadProxy('maps', '3', {
      callback: function () {
        ACMS.Dispatch._static2dynamic(elm)
      },
      options: { region: ACMS.Config.s2dRegion },
    })
  }
  $(elm).click(function () {
    s2dMap()
  })
  window.setTimeout(function () {
    if (elm.getAttribute('width') > ACMS.Config.s2dMaxSize) {
      s2dMap()
    }
  }, 300)
}
ACMS.Dispatch.validator = function (elm) {
  ACMS.Library.Validator.isFunction(false)
  ACMS.Dispatch._validate(elm)
  ACMS.addListener('acmsAddCustomFieldGroup', function (e) {
    ACMS.Dispatch._validate(e.target)
  })
  if (!ACMS.Config.admin) {
    $(elm).submit(function (event) {
      if (!ACMS.Dispatch._validate.all(elm)) {
        ACMS.Dispatch.removeSplash()
        ACMS.Dispatch.Utility.unloadAlert(
          window.document,
          ACMS.Config.unloadAlertMark,
          true,
        )
        event.preventDefault()
        ACMS.dispatchEvent('acmsValidateFailed')
      }
    })
  }
}
ACMS.Dispatch.select2text = function (elm) {
  var self = elm
  var aryValue = []
  $elm = $(':selected', self)
  if (!$elm.size()) {
    $elm = $('option:first-child', self)
  }
  $elm.each(function () {
    aryValue.push($(this).text())
  })
  $(self).replaceWith(aryValue.join(','))
}
ACMS.Dispatch.zebra = function (elm) {
  var tag = elm.tagName.toLowerCase()
  switch (tag) {
    case 'table':
      $('tr:nth-child(odd)', elm).addClass(ACMS.Config.zebraOddClass)
      $('tr:nth-child(even)', elm).addClass(ACMS.Config.zebraEvenClass)
      break
    case 'ul':
    case 'ol':
      $('li:nth-child(odd)', elm).addClass(ACMS.Config.zebraOddClass)
      $('li:nth-child(even)', elm).addClass(ACMS.Config.zebraEvenClass)
      break
    case 'dl':
      $('dt:nth-child(odd)', elm).addClass(ACMS.Config.zebraOddClass)
      $('dt:nth-child(even)', elm).addClass(ACMS.Config.zebraEvenClass)
      $('dd:nth-child(odd)', elm).addClass(ACMS.Config.zebraOddClass)
      $('dd:nth-child(even)', elm).addClass(ACMS.Config.zebraEvenClass)
      break
  }
}
ACMS.Dispatch.placeholder = function (elm) {
  var $self = $(elm)
  $.data(elm, 'placeholder-string', $self.attr('title'))
  $.data(elm, 'placeholder-color', $self.css('color'))
  switch ($self.val()) {
    case '':
      $self.val($.data(elm, 'placeholder-string'))
    case $.data(elm, 'placeholder-string'):
      $self.css('color', ACMS.Config.placeholderColor)
      break
  }
  $self.focus(function () {
    if ($(this).val() == $.data(this, 'placeholder-string')) {
      $(this).val('')
      $(this).css('color', $.data(this, 'placeholder-color'))
    }
  })
  $self.blur(function () {
    if ($(this).val() == '') {
      $(this).val($.data(this, 'placeholder-string'))
      $(this).css('color', ACMS.Config.placeholderColor)
    }
  })
  $self
    .parents()
    .filter('form')
    .submit(function () {
      if ($self.val() == $.data(elm, 'placeholder-string')) {
        $self.val('')
      }
      return true
    })
}
ACMS.Dispatch.incrementalSearch = function (elm) {
  var $input = $(ACMS.Config.incrementalSearchBoxMark)
  var $item = $(ACMS.Config.incrementalSearchElementMark, elm)
  var placeholder = $input.attr('placeholder')
  $input.keyup(function () {
    var search = this.value.split(' ')
    if (
      0 ||
      (search.length === 1 && search[0] === placeholder) ||
      (search.length === 2 && search[0] + ' ' + search[1] === placeholder)
    ) {
      return false
    }
    for (var i = 0; i < $item.length; i++) {
      var itemName = $($item[i]).text()
      if (itemName.match(new RegExp(search[0], 'i'))) {
        $($item[i]).show()
        if (search.length > 1) {
          for (var j = 1; j < search.length; j++) {
            if (!itemName.match(new RegExp(search[j], 'i'))) {
              $($item[i]).hide()
            }
          }
        }
      } else {
        $($item[i]).hide()
      }
    }
    return false
  })
  if ($input.val().length) {
    $input.keyup()
  }
}
ACMS.Dispatch.crossBrowserPlaceholder = function (elm) {
  var $self = $(elm),
    placeholderText = $self.attr('placeholder'),
    placeholderColor = '#999',
    defaultColor = $self.css('color')
  $self
    .focus(function () {
      if ($self.val() === placeholderText) {
        $self.val('').css('color', defaultColor)
      }
    })
    .blur(function () {
      if (
        $self.attr('type') !== 'password' &&
        $self.val().replace(/[\s\t\n\r]/g, '') === ''
      ) {
        $self.val(placeholderText).css('color', placeholderColor)
      } else if ($self.val() === placeholderText) {
        $self.css('color', placeholderColor)
      }
    })
    .blur()
    .parents('form')
    .submit(function () {
      if ($self.val() === placeholderText) {
        $self.val('')
      }
    })
}
ACMS.Dispatch.hover = function (elm) {
  ;(function (className) {
    $(elm).hover(
      function () {
        $(this).addClass(className)
      },
      function () {
        $(this).removeClass(className)
      },
    )
  })(ACMS.Config.hoverClass)
}
ACMS.Dispatch.selection = function (elm) {
  $(elm).click(function () {
    $(this).select()
    return false
  })
}
ACMS.Dispatch.countup = function (elm) {
  $(elm)
    .bind('keydown change', function () {
      var $self = $(this),
        length = Array.from($self.val()).length,
        max = $self.data('max'),
        target = $self.data('label-target')
      ;($target = $(target)), (active = ACMS.Config.countupMarkOver)
      $target.html(length)
      if (length > max) {
        $target.addClass(active)
        $self.addClass(active)
      } else {
        $target.removeClass(active)
        $self.removeClass(active)
      }
    })
    .trigger('change')
}
ACMS.addListener('acmsAddUnit', function (event) {
  $(ACMS.Config.fieldgroupSortableMark, event.obj.item).each(function () {
    ACMS.Dispatch.fieldgroupSortable(this)
  })
})
ACMS.Dispatch.fieldgroupSortable = function (elm) {
  var Config = ACMS.Config
  var $sortable = $(elm)
  var $insert = $sortable.find(Config.fieldgroupSortableItemInsertMark)
  var $delete = $sortable.find(Config.fieldgroupSortableItemDeleteMark)
  var $anchor = $sortable.find(Config.fieldgroupSortableItemTemplateMark)
  var $maxSize = $sortable.find(Config.fieldgroupSortableItemMaxMark).val()
  var $template = $anchor.clone()
  if ($sortable.hasClass('editing')) {
    return
  }
  $sortable.addClass('editing')
  function number() {
    var $rows = $sortable
      .find(Config.fieldgroupSortableItemMark)
      .not(Config.fieldgroupSortableItemTemplateMark)
    var n = 0
    $rows.each(function () {
      $(':input[name$="]"]', this).each(function () {
        this.name = n + '-' + this.name
        if (this.id && !/\[\d*\]/.exec(this.id)) {
          this.id += '[]'
        }
      })
      $('label', this).each(function () {
        var labelFor = $(this).attr('for')
        if (labelFor && !/\[\d*\]/.exec(labelFor)) {
          $(this).attr('for', labelFor + '[]')
        }
      })
      n++
    })
    n = 0
    $rows.each(function () {
      $(':input[name$="]"]', this).each(function () {
        this.name = this.name.replace(/\[\d*\]/, '[' + n + ']')
        if (this.id) {
          this.id = this.id.replace(/\[\d*\]/, '[' + n + ']')
          if ($(this).hasClass('hasDatepicker')) {
            $(this).datepicker('destroy')
            ACMS.Dispatch.datepicker(this)
          }
        }
      })
      $('label', this).each(function () {
        var attrFor = $(this).attr('for')
        if (attrFor) {
          $(this).attr('for', attrFor.replace(/\[\d*\]/, '[' + n + ']'))
        }
      })
      n++
    })
    n = 0
    $rows.each(function () {
      var regex = new RegExp('^' + n + '-')
      $(':input[name$="]"]', this).each(function () {
        this.name = this.name.replace(regex, '')
      })
      n++
    })
  }
  function addSotableItem() {
    var $clone = $template.clone()
    $clone
      .removeClass(Config.fieldgroupSortableItemTemplateMark.substr(1))
      .show()
    $clone
      .find(Config.fieldgroupSortableItemHandleMark)
      .css('cursor', 'pointer')
    $clone
      .find(Config.fieldgroupSortableItemDeleteMark)
      .on('click', handleDelete)
    $anchor.before($clone)
    ACMS.dispatchEvent('acmsAddCustomFieldGroup', $clone.get(0), {
      item: $clone.get(0),
    })
    return $clone
  }
  function refreshSotable() {
    number()
    ACMS.Dispatch($sortable)
  }
  function handleInsert() {
    if ($maxSize == parseInt($maxSize)) {
      var count = $sortable.find(Config.fieldgroupSortableItemMark).size()
      if (count > $maxSize) {
        alert(
          Config.fieldgroupSortableItemOverflowMessage1 +
            $maxSize +
            Config.fieldgroupSortableItemOverflowMessage2,
        )
        return
      }
    }
    $item = addSotableItem()
    number()
    ACMS.Dispatch($item)
  }
  function handleDelete(e) {
    var msg = Config.fieldgroupSortableItemDeleteMessage
    if (msg.length && !confirm(msg)) {
      return
    }
    var $targetItem = $(e.target).parents(Config.fieldgroupSortableItemMark)
    $targetItem.remove()
    refreshSotable()
  }
  if ($anchor.length > 0) {
    $anchor.hide().find(':input').attr('disabled', 'disabled')
  }
  var $sortableItem = $sortable
    .find(Config.fieldgroupSortableItemMark)
    .not(Config.fieldgroupSortableItemTemplateMark)
  if ($sortableItem.length === 0) {
    addSotableItem()
  }
  number()
  $sortableItem.find(':radio[checked]').prop('checked', true)
  $sortable
    .find(Config.fieldgroupSortableItemHandleMark)
    .css('cursor', 'pointer')
  $sortable.sortable({
    items: Config.fieldgroupSortableItemMark,
    handle: Config.fieldgroupSortableItemHandleMark,
    axis: 'y',
    stop: function () {
      refreshSotable()
    },
  })
  if ($insert.length > 0) {
    $insert.on('click', handleInsert)
  }
  if ($delete.length > 0) {
    $delete.on('click', handleDelete)
  }
}
ACMS.Dispatch.acmsAdminTabs = function (elm) {
  var $self = $(elm),
    $tabs = $(),
    $panels = $(),
    $expr = $("a[href^='#']", elm)
  if ($self.hasClass('js-acms_admin_tabs_already')) {
    return false
  }
  $self.addClass('js-acms_admin_tabs_already')
  $('a', elm).each(function () {
    var href = $(this).attr('href')
    href = href.replace(/https:.*\//, '')
    $(this).attr('href', href)
  })
  function buildTab(panel) {
    var $panel = $(panel)
    var hash = panel.replace(/^#/, '')
    $panels.hide()
    $panel.show(0, function () {
      ACMS.dispatchEvent('acmsAdminShowTabPanel', this)
    })
    $('#js-tooltip').remove()
    if (
      location.hash != panel &&
      !_.contains(['entry-edit', 'entry_editor'], ACMS.Config.admin)
    ) {
      $panel.attr('id', '')
      location.hash = panel
      $panel.attr('id', hash)
    }
    $panel.find('textarea[name^="text_text_"]').trigger('focus')
    $('textarea[name^="text_text_"]').trigger('keyup')
    return false
  }
  $expr.each(function () {
    var panel = $(this).attr('href')
    $tabs = $tabs.add(this)
    $panels = $panels.add($(panel))
    $(this).addClass('js-acms_tab')
    $(this).click(function () {
      $tabs.removeClass('js-acms_tab-active')
      $(this).addClass('js-acms_tab-active')
      buildTab(panel)
      return false
    })
  })
  $panels.hide()
  var panel = $expr.filter(':first').addClass('js-acms_tab-active').attr('href')
  if (!location.hash || (!!location.hash && $(location.hash).length === 0)) {
    $(panel).show(0, function () {
      ACMS.dispatchEvent('acmsAdminShowTabPanel', this)
    })
    $expr.filter("a[href='js-ready-acms_tabs']").click()
    $expr.filter('.js-ready-acms_tabs').click()
  } else {
    buildTab(location.hash)
    $tabs.removeClass('js-acms_tab-active')
    $expr
      .filter("a[href='" + location.hash + "']")
      .addClass('js-acms_tab-active')
      .show()
    $(window).scrollTop(0)
  }
}
ACMS.Dispatch.offcanvas = function (context) {
  var opt = ACMS.Config.offcanvas
  var $this = $(opt.offcanvasMark, context)
  var $body = $('body')
  var winPos = { x: window.scrollX, y: window.scrollY }
  var focusableElements =
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]'
  if ($this.hasClass('js-acms-offcanvas-sidebar')) {
    return
  }
  $this.addClass('js-acms-offcanvas-sidebar')
  $this.wrap('<div class="js-acms-offcanvas" />')
  var $parent = $this.parent('.js-acms-offcanvas')
  $parent.attr('aria-hidden', 'true')
  $body.addClass('js-acms-offcanvas-body')
  if (opt.openBtnMark) {
    $(opt.openBtnMark)
      .addClass('js-acms-offcanvas-btn')
      .attr('aria-expanded', false)
      .attr('aria-label', 'Menu')
      .attr('aria-controls', $this.attr('id'))
  }
  if (opt.fixedHeaderMark) {
    $(opt.fixedHeaderMark).addClass('js-acms-header-fixed')
  }
  $(window)
    .resize(
      _.throttle(function () {
        if ($('.js-acms-offcanvas').hasClass('js-acms-offcanvas-open')) {
          return
        }
        if (opt.breakpoint == 'all' || opt.breakpoint >= window.innerWidth) {
          $('.js-acms-offcanvas').addClass('js-acms-offcanvas-active')
          $('.js-acms-offcanvas').attr('aria-hidden', true)
        } else {
          $('.js-acms-offcanvas').removeClass('js-acms-offcanvas-active')
          $('.js-acms-offcanvas').attr('aria-hidden', false)
        }
      }, opt.throttleTime),
    )
    .resize()
  $('.js-acms-offcanvas-btn').click(function (e) {
    var $this = $(this)
    var id = $(this).attr('href') || $(this).data('target')
    var $nav = $('.js-acms-offcanvas-sidebar' + id)
    var $target = $nav.parent('.js-acms-offcanvas')
    var $first = $target.find(focusableElements).first()
    var $last = $target.find(focusableElements).last()
    $this.attr('aria-expanded', true)
    $first
      .off('keydown.acms-offcanvas')
      .on('keydown.acms-offcanvas', function (e) {
        if (e.which === 9 && e.shiftKey) {
          e.preventDefault()
          $last.focus()
        }
      })
    $last
      .off('keydown.acms-offcanvas')
      .on('keydown.acms-offcanvas', function (e) {
        if (e.which === 9 && !e.shiftKey) {
          e.preventDefault()
          $first.focus()
        }
      })
    $last.off('click.acms-offcanvas').on('click.acms-offcanvas', function () {
      $target.click()
      $this.focus()
    })
    if ($this.is(opt.openBtnRMark)) {
      $nav.addClass('js-acms-offcanvas-sidebar-right')
    } else if ($this.is(opt.openBtnLMark)) {
      $nav.addClass('js-acms-offcanvas-sidebar-left')
    }
    winPos.x = window.scrollX
    winPos.y = window.scrollY
    var $body = $('body').css({
      width: window.innerWidth,
      height: $(window).height(),
    })
    $target.addClass('js-acms-offcanvas-open').attr('aria-hidden', false)
    setTimeout(function () {
      $('html').css('marginTop', -1 * window.scrollY)
      if ($nav.hasClass('js-acms-offcanvas-sidebar-right')) {
        $body.addClass('js-acms-offcanvas-body-right')
      } else {
        $body.addClass('js-acms-offcanvas-body-left')
      }
      $nav.addClass('active')
      $first.focus()
    }, 1)
    e.preventDefault()
  })
  var closeOffcanvas = function () {
    $('.js-acms-offcanvas-body').addClass('js-acms-offcanvas-body-moving')
    $('.js-acms-offcanvas-body').removeClass('js-acms-offcanvas-body-right')
    $('.js-acms-offcanvas-body').removeClass('js-acms-offcanvas-body-left')
    $('.js-acms-offcanvas-sidebar').removeClass('active')
    setTimeout(function () {
      $('.js-acms-offcanvas')
        .removeClass('js-acms-offcanvas-open')
        .attr('aria-hidden', true)
      $('.js-acms-offcanvas-body').removeClass('js-acms-offcanvas-body-moving')
      $('.js-acms-offcanvas-btn').attr('aria-expanded', false)
      $('html').css('marginTop', '')
      $('body').css({ width: '', height: '' })
      window.scrollTo(winPos.x, winPos.y)
    }, 300)
  }
  $(opt.closeBtnMark).bind('click touchstart', function (e) {
    closeOffcanvas()
  })
  $('.js-acms-offcanvas').bind('click touchstart', function (e) {
    if ($(e.target).hasClass('js-acms-offcanvas')) {
      e.preventDefault()
      closeOffcanvas()
    }
  })
}
ACMS.Dispatch.imageUnitAjaxUpload = function () {
  if (!window.FormData) {
    return
  }
  if (!/iP(hone|(o|a)d)/.test(window.navigator.userAgent)) {
    return
  }
  var $ajaxUploadImage = $('.js-ajax_upload_image')
  $ajaxUploadImage.unbind('submit.ajax_upload_image')
  $ajaxUploadImage.bind('submit.ajax_upload_image', function (e) {
    e.preventDefault()
    var formData = ACMS.Library.PerfectFormData(this, 'js-img_resize_data')
    formData.append('ajaxUploadImageAccess', true)
    $.ajax({
      async: true,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      dataType: 'json',
    }).done(function (json) {
      if (json.action === 'redirect') {
        location.href = json.url
      } else if (json.action === 'post') {
        var form = document.createElement('form')
        var submit = document.createElement('input')
        var data = document.createElement('input')
        var token = document.createElement('input')
        submit.name = 'ACMS_POST_Through'
        submit.value = 'on'
        submit.type = 'hidden'
        data.name = 'throughPost'
        data.type = 'hidden'
        data.value = json.throughPost
        token.name = 'formToken'
        token.type = 'hidden'
        token.value = 'true'
        form.method = 'post'
        form.appendChild(submit)
        form.appendChild(data)
        form.appendChild(token)
        document.body.appendChild(form)
        form.submit()
      } else {
        location.reload()
      }
    })
  })
}
ACMS.Dispatch.prettyScroll = function (context) {
  var config = Object.assign({}, ACMS.Config.prettyScrollConfig)
  if (context.dataset.offsetTop) {
    config.offsetTop = parseInt(context.dataset.offsetTop, 10)
  }
  if (context.dataset.offsetBottom) {
    config.offsetBottom = parseInt(context.dataset.offsetBottom, 10)
  }
  if (context.dataset.breakpoint) {
    config.breakpoint = parseInt(context.dataset.breakpoint, 10)
  }
  new ACMS.Library.PrettyScroll(context, config)
}
