<?php

class ACMS_GET_Touch_SessionIsSubscription extends ACMS_GET
{
    public $_scope = array(
        'bid'   => 'global',
    );

    function get()
    {
        return (isSessionSubscriber() && sessionWithSubscription($this->bid) && !Preview::isPreviewMode()) ? $this->tpl : false;
    }
}
