ACMS.Config.Edit = {}
ACMS.Config.Edit.unitMark = '.entryFormColumn'
ACMS.Config.Edit.itemMark = '.entryFormColumnItem'
ACMS.Config.Edit.itemHeadMark = '.entryFormColumnHead'
ACMS.Config.Edit.itemBodyMark = '.entryFormColumnBody'
ACMS.Config.Edit.stateSort = false
ACMS.Config.Edit.exFeaturesInited = false
ACMS.Dispatch.Edit = function (context) {
  var Edit = arguments.callee
  var $unit = $(ACMS.Config.Edit.unitMark, context)
  $unit.$range = $(':input[name="summary_range"]', context)
  $unit.$more = $unit.find('#more')
  $unit.$more.show()
  if ($unit.$range.size()) {
    if (parseInt($unit.$range.val(), 10)) {
      $unit.$more.detach()
      $unit
        .find(ACMS.Config.Edit.itemMark)
        .eq($unit.$range.val() - 1)
        .after($unit.$more)
    } else if ('' === $unit.$range.val()) {
      $unit.$more.detach()
      $unit.append($unit.$more)
    }
  } else {
    $unit.$more.remove()
  }
  $unit.$target = $('.ablogcms--column-add-btn', context)
  Edit._refresh($unit)
  Edit._range($unit)
  ACMS.Dispatch.Utility.unloadAlert(context)
  if ($('img.column-map', $unit).size()) {
    ACMS.Library.googleLoadProxy('maps', '3', {
      callback: function () {
        $(ACMS.Config.Edit.itemMark, $unit).each(function () {
          Edit._item(this, $unit)
        })
      },
      options: { region: ACMS.Config.s2dRegion },
    })
  } else {
    $(ACMS.Config.Edit.itemMark, $unit).each(function () {
      Edit._item(this, $unit)
    })
  }
  Edit._add($unit)
  $('#tagListTrigger', context)
    .each(function () {
      Edit.tagassist(this)
    })
    .show()
  $('.js-extendTagSelect', context).each(function () {
    Edit.extendTagSelect(this)
  })
  $(ACMS.Config.editInplateTitleMark, context).each(function () {
    if (ACMS.Config.eid) {
      Edit._editTitle(this)
    }
  })
  $('.js-edit_inplace', context).each(function () {
    this.inplace = new Edit._inplace(this)
  })
  Edit._experimental()
  if (-1 === navigator.userAgent.indexOf('MSIE 6')) {
    Edit._sortable($unit)
  }
  Edit._indicator(context)
  try {
    if (
      (ACMS.Config.admin === 'entry-edit' ||
        ACMS.Config.admin === 'entry_editor') &&
      ACMS.Config.webStorage === 'on' &&
      typeof localStorage != 'undefined'
    ) {
      Edit._saveform(context)
    }
  } catch (e) {}
  var $map = $('.js-map-editable', context)
  if ($map.size()) {
    $map.bind('click', function () {
      ACMS.Library.googleLoadProxy('maps', '3', {
        callback: function () {
          $map.each(function () {
            ACMS.Dispatch.Edit.map(this)
          })
        },
        options: { region: ACMS.Config.s2dRegion },
      })
    })
  }
  $('.js-acms_admin_tabs', context).each(function () {
    ACMS.Dispatch.acmsAdminTabs(this)
  })
}
ACMS.Dispatch.Edit._saveform = function (context) {
  var $form = $('#entryForm', context),
    time = ACMS.Config.webStorageInterval,
    stop = false,
    bid = ACMS.Config.bid,
    cid = ACMS.Config.cid ? ACMS.Config.cid : '0',
    eid = ACMS.Config.eid ? ACMS.Config.eid : '0',
    data,
    storage
  if (ACMS.Config.webStorageType === 'session') {
    storage = sessionStorage
  } else if (ACMS.Config.webStorageType === 'local') {
    storage = localStorage
  }
  var key = 'acms_bid-' + bid + '_cid-' + cid + '_eid-' + eid
  data = storage.getItem(key)
  if (data !== null) {
    var $popup = $('<p>' + ACMS.i18n('edit.message4') + '</p>')
    var $module = $(':submit[name^=ACMS_POST]', $form).attr('name')
    data = JSON.parse(data)
    $popup.dialog({
      title: ACMS.i18n('edit.message5'),
      resizable: false,
      modal: true,
      autoOpen: false,
      buttons: [
        {
          text: ACMS.i18n('edit.message5'),
          click: function () {
            storage.removeItem(key)
            stop = true
            storage = null
            var $form = $('<form/>', {
              action: '',
              method: 'post',
              enctype: 'multipart/form-data',
            })
            $.each(data, function (i, field) {
              if (field.value.match(/acms-file/i)) {
                $form.append($('<input/>', { type: 'file', name: field.name }))
              } else {
                $form.append(
                  $('<input/>', {
                    type: 'hidden',
                    name: field.name,
                    value: field.value,
                  }),
                )
              }
            })
            $form.append(
              $('<input/>', { type: 'hidden', name: $module, value: 'save' }),
            )
            $form.append(
              $('<input/>', {
                type: 'hidden',
                name: 'recover_acms_Po9H2zdPW4fj',
                value: '',
              }),
            )
            $form.append(
              $('<input/>', {
                type: 'hidden',
                name: 'field[]',
                value: 'recover_acms_Po9H2zdPW4fj',
              }),
            )
            $form.append(
              $('<input/>', {
                type: 'hidden',
                name: 'recover_acms_Po9H2zdPW4fj' + ':v#required',
              }),
            )
            $form.appendTo(document.body)
            $form.submit()
          },
        },
        {
          text: ACMS.i18n('edit.message6'),
          click: function () {
            saveWebStorage()
            $popup.dialog('destroy')
            $popup.remove()
          },
        },
      ],
    })
    $popup.parent().css({ position: 'fixed' }).end().dialog('open')
  } else if (bid) {
    saveWebStorage()
  }
  function saveWebStorage() {
    storage.removeItem(key)
    setTimeout(function () {
      $form.bind('input', function () {
        var timer = setInterval(function () {
          if (storage) {
            var $tmp = $form.clone(false)
            $form.find('select').each(function (i) {
              $tmp.find('select').eq(i).val($(this).val())
            })
            $tmp.find('[type=file]').attr('type', 'hidden').val('acms-file')
            var serialize = $tmp.serializeArray()
            serialize = JSON.stringify(serialize)
            storage.setItem(key, serialize)
          }
          if (stop) {
            clearInterval(timer)
            timer = null
          }
        }, time)
        $form.unbind('input')
      })
    }, 500)
  }
}
ACMS.Dispatch.Edit._indicator = function (context) {
  var $form = $('#entryForm', context),
    $back = $('[name^="ACMS_POST_2GET"]', context)
  $form.bind('submit', function () {
    ACMS.Dispatch.splash(ACMS.i18n('edit.message7'))
    return true
  })
  $back.bind('click', function () {
    $form.unbind('submit')
  })
}
ACMS.Dispatch.Edit._editTitle = function (elm) {
  var $self = $(elm)
  var $inplaceWrapper = $('.js-edit_inplace').parent()
  if ($inplaceWrapper.length && !ACMS.Config.Edit.stateSort) {
    $self.addClass('js-edit_inplace-title_trigger')
  }
  $('.js-edit_inplace-title_trigger').on('click', function (event) {
    event.preventDefault()
    ACMS.Dispatch.splash()
    var $detailBox = $('#js-edit_inplace-detail'),
      eid = ACMS.Config.eid
    var $backdrop = $('.acms-admin-modal-backdrop')
    if (!$backdrop.length) {
      $backdrop = $(
        $.parseHTML('<div class="acms-admin-modal-backdrop"></div>'),
      )
        .hide()
        .appendTo('body')
    }
    var code =
      '            <div id="js-edit_inplace-detail" class="acms-admin-modal out">                <div class="acms-admin-modal-dialog large">                    <div class="acms-admin-modal-content">                        <div class="acms-admin-modal-header">                            <i class="acms-admin-modal-hide acms-admin-icon-delete"></i>                            <h3>基本設定 / 詳細設定</h3>                        </div>                        <div class="acms-admin-modal-body">                            <div class="acms-admin-padding-small"></div>                        </div>                    </div>                </div>            </div>'
    if (!$detailBox.length) {
      $detailBox = $($.parseHTML(code)).appendTo('body')
    } else {
      $detailBox.empty().remove()
      $detailBox = $($.parseHTML(code)).appendTo('body')
    }
    $.ajax({
      type: 'GET',
      url: ACMS.Library.acmsLink(
        {
          eid: eid,
          tpl: 'admin/entry/edit.html',
          admin: 'entry-edit',
          Query: { hash: Math.random().toString() },
        },
        true,
      ),
      dataType: 'html',
      success: function (res) {
        ACMS.Dispatch.removeSplash()
        var action = ACMS.Library.acmsLink(
            {
              eid: eid,
              admin: 'entry-edit',
              Query: { hash: Math.random().toString() },
            },
            true,
          ),
          html = res.replace(
            /ACMS_POST_Entry_Update/,
            'ACMS_POST_Entry_Update_Detail',
          ),
          $raw = $($.parseHTML(html))
            .attr('action', action)
            .removeClass('js-ajax_upload_image')
        $(
          '.entryFormColumn, .formEntryAction, .js-revision_action',
          $raw,
        ).remove()
        $('.entryFormTable', $raw).css('background-color', '#FFF')
        if ($detailBox.length) {
          $('body').css('overflow', 'hidden')
          $detailBox
            .find('.acms-admin-modal-body > .acms-admin-padding-small')
            .append($raw)
          $detailBox.show()
          $backdrop.show()
          setTimeout(function () {
            $detailBox
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
        var modalBody = $detailBox.find('.acms-admin-modal-body').get(0)
        ACMS.Dispatch($detailBox)
        ACMS.Dispatch.Edit($detailBox)
        ACMS.dispatchEvent('acmsDialogOpened', modalBody, { item: modalBody })
        var closeFn = function () {
          $('body').css('overflow', '')
          $backdrop.fadeOut()
          $detailBox.removeClass('display').addClass('out')
          setTimeout(function () {
            $detailBox.hide()
          }, 500)
          return false
        }
        $('.acms-admin-modal-hide').bind('click', closeFn)
        $('.cancelBtn').attr('onclick', '').val('閉じる').bind('click', closeFn)
        $detailBox.click(function (event) {
          var click = event.target
          if ($(click).hasClass('acms-admin-modal')) {
            closeFn()
          }
        })
      },
    })
  })
}
ACMS.Dispatch.Edit.tagassist = function (elm) {
  $(elm).click(function () {
    ACMS.Dispatch.Edit._tagassist(this)
    return false
  })
}
ACMS.Dispatch.Edit._refresh = function ($unit) {
  $unit.order = $(':input[name="sort[]"]', $unit).map(function () {
    var $row = $(this).closest('.entryFormColumnItem')
    this.preValue = $(this).val()
    $row.find('[for^=unit-align-]').attr('for', 'unit-align-' + this.preValue)
    $row.find('[id^=unit-align-]').attr('id', 'unit-align-' + this.preValue)
    $row.find('[for^=unit-group-]').attr('for', 'unit-group-' + this.preValue)
    $row.find('[id^=unit-group-]').attr('id', 'unit-group-' + this.preValue)
    $row.find('[for^=unit-attr-]').attr('for', 'unit-attr-' + this.preValue)
    $row.find('[id^=unit-attr-]').attr('id', 'unit-attr-' + this.preValue)
    return this.preValue
  })
  if (
    1 &&
    $unit.$range.size() &&
    (0 ||
      '' !== $unit.$range.val() ||
      $unit.$more.nextAll(ACMS.Config.Edit.itemMark).size())
  ) {
    $unit.$range.val($unit.$more.prevAll(ACMS.Config.Edit.itemMark).size())
  }
  $('.js-tabs2').tabs({
    activate: function (event, ui) {
      $('textarea[name^="text_text_"]', ui.newPanel).trigger('keyup')
    },
  })
  $('.js-acms_admin_tabs', $unit).each(function () {
    ACMS.Dispatch.acmsAdminTabs(this)
  })
}
ACMS.Dispatch.Edit._remove = function (item, $unit) {
  var value = parseInt($(item).find(':input[name="sort[]"]', item).val(), 10)
  $(ACMS.Config.Edit.itemMark, $unit).each(function () {
    $(this)
      .find(':input[name="sort[]"] option')
      .each(function () {
        var _value = $(this).attr('value')
        if (value == _value) {
          $(this).remove()
        } else if (value < _value) {
          $(this).val(_value - 1)
          $(this).text(_value - 1)
        }
      })
  })
  if ($unit.$range.size()) {
    var rangeVal = $unit.$range.val()
    $unit.$range.find('option').each(function () {
      var _value = $(this).attr('value')
      if (value == _value) {
        $(this).remove()
      } else if (value < _value) {
        $(this).val(_value - 1)
        $(this).text(_value - 1)
      }
    })
    if (rangeVal >= value && rangeVal > 0) {
      $unit.$range.val(rangeVal - 1)
    }
  }
  var type = $(':input[name="type[]"]', item).val(),
    $grave,
    $casket
  if ('image' == type || 'file' == type) {
    if (!$unit.next('#js-grave').size()) {
      $unit.after('<ul id="js-grave" style="display:none;"></ul>')
    }
    $grave = $unit.next()
    $casket = $($.parseHTML('<li></li>'))
    $casket.append(
      $(':input:not(".js-img_resize_data"):not([type="file"])', item),
    )
    $(':input[name^="' + type + '_edit_"]', $casket)
      .val('delete')
      .attr('checked', true)
    $grave.append($casket)
  }
  $(item).remove()
}
ACMS.Dispatch.Edit._sortable = function ($unit) {
  var Edit = this
  var handle = '.sorthandle'
  var browser = ACMS.Dispatch.Utility.browser()
  if (browser.mobile || browser.tablet) {
    handle += ' .js-sp-sort-handle'
  }
  $unit.sortable({
    handle: handle,
    cancel: '',
    zIndex: 999,
    opacity: 0.6,
    stop: function (_, ui) {
      $('textarea[name^="text_text_"]', ui.item).each(function () {
        if (!ACMS.Dispatch.wysiwyg.isAdapted(this)) {
          return
        }
        ACMS.Dispatch.wysiwyg.destroy()
        $(this).removeData()
      })
      if ('wysiwyg' === $(':input[name^="text_tag_"]', ui.item).val()) {
        $('textarea[name^="text_text_"]', ui.item).each(function () {
          if (!ACMS.Dispatch.wysiwyg.isAdapted(this)) {
            ACMS.Dispatch.wysiwyg.init(this)
          }
        })
      }
      if ($(ui.item).is(ACMS.Config.Edit.itemMark)) {
        $(':input[name="sort[]"]', $unit).each(function (i) {
          $(this).val($unit.order.get(i))
        })
      }
      Edit._refresh($unit)
    },
  })
}
ACMS.Dispatch.Edit._range = function ($unit) {
  $unit.$range.change(function () {
    var range = $(this).val()
    if (parseInt(range, 10)) {
      var item = null
      $unit.find(ACMS.Config.Edit.itemMark).each(function (i) {
        if (range >= i + 1) {
          item = this
        }
      })
      if (item) {
        $unit.$more.detach()
        $(item).after($unit.$more)
      }
    } else if ('0' === range) {
      $unit.$more.detach()
      $unit.prepend($unit.$more)
    } else {
      $unit.$more.detach()
      $unit.append($unit.$more)
    }
  })
}
ACMS.Dispatch.Edit.extendTagSelect = function (elm) {
  var $tag = $('[name^=text_tag_]', elm),
    $field = $('[name^=text_extend_tag_]', elm),
    $extend = $('.acms-admin-extend-field', elm)
  $tag
    .change(function () {
      $xdata = $tag.children(':selected').data('tag_extend')
      if ($xdata) {
        $extend.text($xdata)
        $extend.show()
        $field.show()
      } else {
        $extend.text('')
        $extend.hide()
        $field.hide()
      }
    })
    .trigger('change')
}
ACMS.addListener('acmsAddUnit', function (event) {
  $('.js-formUnitGroup', event.obj.item).each(function () {
    ACMS.Dispatch.Edit.formUnitGroup(this)
  })
})
ACMS.addListener('acmsAddCustomFieldGroup', function (event) {
  $(event.obj.item).find(':radio[checked]').prop('checked', true)
})
ACMS.Dispatch.Edit.formUnitGroup = function (elm) {
  var Config = ACMS.Config
  var $sortable = $(elm)
  var $insert = $sortable.find(Config.fieldgroupSortableItemInsertMark)
  var $anchor = $sortable.find(Config.fieldgroupSortableItemTemplateMark)
  if ($insert.size() && $anchor.size()) {
    var $template = $anchor.clone()
    $anchor.find(':input').attr('disabled', 'disabled')
    $anchor.hide()
    $insert.click(insert)
    var n = 0
    $sortable.find(Config.fieldgroupSortableItemMark).each(function () {
      var $block = $(this)
      n++
    })
    if (!n) {
      var $clone = $template.clone()
      $clone.removeClass(Config.fieldgroupSortableItemTemplateMark.substr(1))
      $(':input[name$="]"]', $clone).each(function () {
        this.name = this.name.replace(/\[\d*\]/, '[0]')
      })
      ACMS.Dispatch($clone)
      ACMS.dispatchEvent('acmsAddCustomFieldGroup', $clone.get(0), {
        item: $clone.get(0),
      })
      $anchor.before($clone)
    }
    $sortable.find(Config.fieldgroupSortableItemDeleteMark).click(function () {
      $(this).parents(Config.fieldgroupSortableItemMark).remove()
      return false
    })
  }
  $sortable
    .find(Config.fieldgroupSortableItemHandleMark)
    .css('cursor', 'pointer')
  function insert() {
    var $clone = $template.clone()
    $clone.removeClass(Config.fieldgroupSortableItemTemplateMark.substr(1))
    $clone.show()
    $clone.find(Config.fieldgroupSortableItemDeleteMark).click(function () {
      $(this).parents(Config.fieldgroupSortableItemMark).remove()
      return false
    })
    $anchor.before($clone)
    $clone
      .find(Config.fieldgroupSortableItemHandleMark)
      .css('cursor', 'pointer')
    ACMS.Dispatch($clone)
    return false
  }
  function number($sortable) {
    var $rows = $sortable
      .find(Config.fieldgroupSortableItemMark)
      .not(Config.fieldgroupSortableItemTemplateMark)
    var n = 0
    $rows.each(function () {
      $(':input[name$="]"]', this).each(function () {
        this.name = n + '-' + this.name
      })
      n++
    })
    n = 0
    $rows.each(function () {
      $(':input[name$="]"]', this).each(function () {
        this.name = this.name.replace(/\[\d*\]/, '[' + n + ']')
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
}
