import Player from '@vimeo/player';
import { addClass, removeClass, toggleClass, on, getActivePlayer, isTouchDevice } from 'utils/helpers';
import { $ } from 'select-dom';
import emitter from 'utils/events';

class VideoPlayer {
  static instances = new WeakMap();

  constructor(el) {
    this.el = el;
    this.vimeoId = el.getAttribute('data-video-id');
    this.player = null;
    this.video = $('.js-video', this.el);
    this.playBtn = $('.js-play', this.el);
    this.fullscreenBtn = $('.js-fullscreen', this.el);
    this.overlay = $('.js-overlay', this.el);
    this.timeline = $('.js-timeline', this.el);
    this.timelineProgress = $('.js-timeline-prog', this.el);
    this.soundBtn = $('.js-sound', this.el);
    this.volumeSettings = $('.js-volume-settings', this.el);
    this.volumeSlider = $('.js-volume-slider', this.el);
    this.volumeState = 0.5;
    this.videoLoaded = false;

    // Remove volume slider if touch device
    if (isTouchDevice() && this.volumeSlider) {
      this.volumeSlider.remove();
    }

    this.setupPlayer();
    this.bindEvents();
  }

  setupPlayer() {
    if (this.videoLoaded) return;

    this.injectIframe();
    this.videoLoaded = true;

    this.player = new Player(this.video);
    this.player.setVolume(this.volumeState);

    this.player.on('timeupdate', ({ seconds, duration }) => {
      this.timelineProgress.style.width = `${(seconds / duration) * 100}%`;
    });

    this.player.on('ended', () => removeClass(this.playBtn, 'active'));
  }

  injectIframe() {
    if (!this.video || this.videoLoaded) return;

    const iframe = document.createElement('iframe');
    iframe.src = `https://player.vimeo.com/video/${this.vimeoId}?controls=0&dnt=1`;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";
    iframe.allow = "autoplay; fullscreen";

    this.video.appendChild(iframe); // Append instead of replacing
  }

  bindEvents() {
    on(this.playBtn, 'click', () => this.togglePlay());
    on(this.overlay, 'click', () => this.togglePlay());
    on(this.fullscreenBtn, 'click', () => this.toggleFullscreen());
    on(this.timeline, 'click', (e) => this.seek(e));
    on(document, 'keydown', (e) => this.handleKeyPress(e));
    on(document, 'fullscreenchange', () => this.handleFullscreenChange());

    if (!isTouchDevice()) {
      on(this.soundBtn, 'click', () => toggleClass(this.volumeSettings, 'active'));
      on(this.volumeSlider, 'input', () => this.adjustVolume(this.volumeSlider.value));
    } else {
      on(this.soundBtn, 'click', () => this.toggleVolume());
    }

    on(document, 'click', (e) => {
      if (this.soundBtn && this.volumeSettings && 
          !this.soundBtn.contains(e.target) && !this.volumeSettings.contains(e.target)) {
        removeClass(this.volumeSettings, 'active');
      }
    });

    emitter.on('closeModal', () => this.reset());
    emitter.on('openModal', () => this.togglePlay());
  }

  adjustVolume(value) {
    this.player.setVolume(value);
    this.updateSoundButtonClass(value);
  }

  toggleVolume() {
    this.volumeState = this.volumeState === 1 ? 0 : 1;
    this.adjustVolume(this.volumeState);
  }

  updateSoundButtonClass(volume) {
    removeClass(this.soundBtn, 'set-0 set-50');
    addClass(this.soundBtn, volume === 0 ? 'set-0' : volume < 0.6 ? 'set-50' : '');
  }

  handleKeyPress(event) {
    if (event.code === 'Space' && getActivePlayer() === this.el) {
      event.preventDefault();
      this.playBtn.focus();
      this.togglePlay();
    }
  }

  togglePlay() {
    if (getActivePlayer() === this.el) {
      this.player.getPaused().then((paused) => {
        paused ? this.player.play() : this.player.pause();
        toggleClass(this.playBtn, 'active', !paused);
      });
    }
  }

  reset() {
    this.player.pause();
    this.player.setCurrentTime(0);
    this.adjustVolume(0.5);
    removeClass(this.playBtn, 'active');
  }

  toggleFullscreen() {
    document.fullscreenElement ? document.exitFullscreen() : this.el.requestFullscreen();
  }

  handleFullscreenChange() {
    toggleClass(this.fullscreenBtn, 'active', !!document.fullscreenElement);
    toggleClass(this.el, 'is-fullscreen', !!document.fullscreenElement);
  }

  seek(event) {
    this.player.getDuration().then((duration) => {
      const newTime = ((event.pageX - this.timeline.getBoundingClientRect().left) / this.timeline.offsetWidth) * duration;
      this.player.setCurrentTime(newTime);
    });
  }

  static init(el) {
    if (!VideoPlayer.instances.has(el)) {
      VideoPlayer.instances.set(el, new VideoPlayer(el));
    }
  }
}

export default VideoPlayer;
