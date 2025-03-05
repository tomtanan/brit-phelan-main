import 'scripts/init';
import 'styles/main.css';
import { $, $$ } from 'select-dom';
import { isTouchDevice, removeClass, splitIntoWords, splitIntoLetters } from 'utils/helpers';

splitIntoWords($$('.js-text-beautifier'));
splitIntoLetters($$('.js-text-beautifier a'));

if (isTouchDevice()) removeClass($('body'), 'no-touch');
