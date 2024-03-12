<?php

class ACMS_GET_Admin_Media_Tag_Edit extends ACMS_GET_Admin_Edit
{
    public $_scope = array(
        'tag' => 'global',
    );

    function auth()
    {
        if (roleAvailableUser()) {
            if (!roleAuthorization('tag_edit', BID)) {
                return false;
            }
        } else {
            if (!sessionWithCompilation()) {
                return false;
            }
        }
        return true;
    }

    function edit(&$Tpl)
    {
        if (!$this->Post->isExists('tag')) {
            $this->Post->set('tag', $this->Q->get('tag'));
        }
        return true;
    }

    function _get()
    {
        if ('media-tag_edit' <> ADMIN) {
            return false;
        }
        if (!TAG) {
            return false;
        }
        if (roleAvailableUser()) {
            if (!roleAuthorization('tag_edit', BID)) {
                return false;
            }
        } else {
            if (!sessionWithCompilation()) {
                return false;
            }
        }
        $Tpl = new Template($this->tpl, new ACMS_Corrector());
        $Tpl->add(null, array('tag' => TAG));
        return $Tpl->get();
    }
}
