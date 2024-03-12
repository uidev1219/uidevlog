<?php

/**
 * @mixin \Acms\Service\View\Engine
 */
class Template
{
    /**
     * @var Acms\Service\View\Engine
     */
    protected $engine;

    /**
     * @param string $txt
     * @param null|ACMS_Corrector $Corrector
     * @return bool
     */
    public function __construct($txt, $Corrector = null)
    {
        $this->engine = View::init($txt, $Corrector);
    }

    public function __call($name, $args)
    {
        if (method_exists($this->engine, $name)) {
            return call_user_func_array(array($this->engine, $name), $args);
        }
    }
}
