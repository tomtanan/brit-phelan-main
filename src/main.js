import 'scripts/init';
import 'styles/main.css';
import { $ } from 'select-dom';
import { isTouchDevice, removeClass } from 'utils/helpers';



if (isTouchDevice()) removeClass($('body'), 'no-touch');
