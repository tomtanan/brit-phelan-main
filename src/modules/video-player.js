import Player from '@vimeo/player';
import { addClass, removeClass, toggleClass, on, getActivePlayer, isTouchDevice } from 'utils/helpers';
import { $ } from 'select-dom';
import emitter from 'utils/events';

class VideoPlayer {
  static instances = new WeakMap();

  constructor(el) {
    this.el = el;
    this.vimeoId = el.getAttribute('data-vimeo-id');
    this.youtubeId = el.getAttribute('data-youtube-id');
    this.isYouTube = this.youtubeId && this.youtubeId.trim() !== '';
    this.player = null;
    this.video = $('.js-video', this.el);
    this.controls = $('.js-controls', this.el);
    this.overlay = $('.js-overlay', this.el);
    this.playBtn = $('.js-play', this.el);
    this.fullscreenBtn = $('.js-fullscreen', this.el);
    this.timeline = $('.js-timeline', this.el);
    this.timelineProgress = $('.js-timeline-prog', this.el);
    this.soundBtn = $('.js-sound', this.el);
    this.volumeSettings = $('.js-volume-settings', this.el);
    this.volumeSlider = $('.js-volume-slider', this.el);
    this.volumeState = 0.5;
    this.videoLoaded = false;

    if (this.isYouTube) {
      if (this.controls) this.controls.remove();
      if (this.overlay) this.overlay.remove();
    }

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

    if (!this.isYouTube) {
      this.player = new Player(this.video);
      this.player.setVolume(this.volumeState);
      this.player.on('timeupdate', ({ seconds, duration }) => {
        this.timelineProgress.style.width = `${(seconds / duration) * 100}%`;
      });
      this.player.on('ended', () => removeClass(this.playBtn, 'active'));
    }
  }

  injectIframe() {
    if (!this.video || this.videoLoaded) return;

    const iframe = document.createElement('iframe');
    if (this.isYouTube) {
      iframe.src = `https://www.youtube.com/embed/${this.youtubeId}?modestbranding=1&rel=0&playsinline=1`;
    } else {
      console.log('test')
      console.log(this.vimeoId);
      iframe.src = `https://player.vimeo.com/video/${this.vimeoId}?controls=0&dnt=1`;
    }
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.style = "border: none;";

    this.video.appendChild(iframe);
    addClass(this.el, 'video-player-loaded');

    this.videoLoaded = true; // Prevent duplicates
  }

  bindEvents() {
    if (!this.isYouTube) {
      on(this.playBtn, 'click', (e) => this.togglePlay());
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

      emitter.on('openModal', () => this.togglePlay());
    }
    emitter.on('resetPlayer', () => this.reset());
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
    
    const classToAdd = volume === 0 ? 'set-0' : volume < 0.6 ? 'set-50' : null;
    if (classToAdd) addClass(this.soundBtn, classToAdd);
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
        emitter.emit('togglePlay', paused);
      });
    }
  }

  reset() {
    console.log(getActivePlayer());
    if (this.isYouTube) {
      const iframe = $('iframe', this.video);
      if (iframe) {
        iframe.src = iframe.src;
      }
    } else {
      this.player.pause();
      this.player.setCurrentTime(0);
      this.adjustVolume(0.5);
      removeClass(this.playBtn, 'active');
    }
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
