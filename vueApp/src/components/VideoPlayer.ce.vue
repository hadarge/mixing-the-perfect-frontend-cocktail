<template>
  <div class="video-player" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
    <div class="video-container">
      <video
          ref="videoElement"
          :src="src"
          :poster="poster"
          @timeupdate="handleTimeUpdate"
          @loadedmetadata="handleLoadedMetadata"
          @ended="handleVideoEnded"
          @waiting="isBuffering = true"
          @playing="isBuffering = false"
          @click="togglePlay"
      ></video>

      <!-- Loading/Buffering Spinner -->
      <div v-if="isBuffering" class="loading-spinner">
        <div class="spinner"></div>
      </div>

      <!-- Play Button Overlay -->
      <div
          v-if="!isPlaying && !isBuffering"
          class="play-overlay"
          @click="togglePlay"
      >
        <button class="play-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>

      <!-- Controls -->
      <div
          :class="['controls', { 'visible': showControls || !isPlaying }]"
      >
        <!-- Progress Bar -->
        <div class="progress-container">
          <div
              class="progress-bar"
              @click="handleProgressClick"
              ref="progressBar"
          >
            <div class="progress-track"></div>
            <div
                class="progress-fill"
                :style="{ width: `${progressPercentage}%` }"
            ></div>
            <div
                class="progress-handle"
                :style="{ left: `${progressPercentage}%` }"
                @mousedown="handleProgressDrag"
            ></div>
          </div>
        </div>

        <!-- Control Buttons -->
        <div class="controls-row">
          <div class="controls-left">
            <!-- Play/Pause -->
            <button class="control-button" @click="togglePlay">
              <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>

            <!-- Volume -->
            <div class="volume-container">
              <button class="control-button" @click="toggleMute">
                <svg v-if="isMuted || volume === 0" viewBox="0 0 24 24" fill="currentColor">
                  <path
                      d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
                <svg v-else-if="volume > 0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path
                      d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
                </svg>
              </button>

              <div class="volume-slider" @click="handleVolumeClick" ref="volumeSlider">
                <div class="volume-track"></div>
                <div
                    class="volume-fill"
                    :style="{ width: `${volume * 100}%` }"
                ></div>
                <div
                    class="volume-handle"
                    :style="{ left: `${volume * 100}%` }"
                    @mousedown="handleVolumeDrag"
                ></div>
              </div>
            </div>

            <!-- Time Display -->
            <div class="time-display">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </div>
          </div>

          <div class="controls-right">
            <!-- Settings -->
            <button class="control-button" @click="toggleSettings">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
              </svg>
            </button>

            <!-- Fullscreen -->
            <button class="control-button" @click="toggleFullscreen">
              <svg v-if="!isFullscreen" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Menu -->
    <div v-if="showSettings" class="settings-menu">
      <div class="settings-item" @click="changePlaybackSpeed(0.5)">
        <span>0.5x</span>
        <span v-if="playbackSpeed === 0.5">✓</span>
      </div>
      <div class="settings-item" @click="changePlaybackSpeed(1)">
        <span>1x</span>
        <span v-if="playbackSpeed === 1">✓</span>
      </div>
      <div class="settings-item" @click="changePlaybackSpeed(1.25)">
        <span>1.25x</span>
        <span v-if="playbackSpeed === 1.25">✓</span>
      </div>
      <div class="settings-item" @click="changePlaybackSpeed(1.5)">
        <span>1.5x</span>
        <span v-if="playbackSpeed === 1.5">✓</span>
      </div>
      <div class="settings-item" @click="changePlaybackSpeed(2)">
        <span>2x</span>
        <span v-if="playbackSpeed === 2">✓</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  props: {
    src: {
      type: String,
      required: true
    },
    poster: {
      type: String,
      default: ''
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    },
    onPlay: {
      type: Function
    },
    onPause: {
      type: Function
    }
  },
  data() {
    return {
      isPlaying: false,
      isBuffering: false,
      isMuted: false,
      isFullscreen: false,
      showControls: true,
      showSettings: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      playbackSpeed: 1,
      isDragging: false,
      controlsTimeout: null
    }
  },
  computed: {
    progressPercentage() {
      return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
    }
  },
  mounted() {
    if (this.autoplay) {
      this.$nextTick(() => {
        this.play();
      });
    }

    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('keydown', this.handleKeydown);
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }
  },
  methods: {
    togglePlay() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    },

    play() {
      this.$refs.videoElement.play();
      this.isPlaying = true;
      this.hideControlsAfterDelay();
      this.$emit('play');
      if (this.onPlay)
        this.onPlay();
    },

    pause() {
      this.$refs.videoElement.pause();
      this.isPlaying = false;
      this.showControls = true;
      this.$emit('pause');
      if (this.onPause)
        this.onPause();
    },

    toggleMute() {
      this.isMuted = !this.isMuted;
      this.$refs.videoElement.muted = this.isMuted;
    },

    toggleFullscreen() {
      if (!this.isFullscreen) {
        this.$el.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    },

    toggleSettings() {
      this.showSettings = !this.showSettings;
    },

    handleTimeUpdate() {
      this.currentTime = this.$refs.videoElement.currentTime;
    },

    handleLoadedMetadata() {
      this.duration = this.$refs.videoElement.duration;
    },

    handleVideoEnded() {
      this.isPlaying = false;
      if (this.loop) {
        this.$refs.videoElement.currentTime = 0;
        this.play();
      }
      this.$emit('ended');
    },

    handleProgressClick(event) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const percentage = (event.clientX - rect.left) / rect.width;
      this.seekTo(percentage * this.duration);
    },

    handleVolumeClick(event) {
      const rect = this.$refs.volumeSlider.getBoundingClientRect();
      const percentage = (event.clientX - rect.left) / rect.width;
      this.setVolume(Math.max(0, Math.min(1, percentage)));
    },

    handleProgressDrag(event) {
      this.isDragging = true;
      const handleDrag = (e) => {
        if (this.isDragging) {
          const rect = this.$refs.progressBar.getBoundingClientRect();
          const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          this.seekTo(percentage * this.duration);
        }
      };

      const stopDrag = () => {
        this.isDragging = false;
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', stopDrag);
      };

      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', stopDrag);
    },

    handleVolumeDrag(event) {
      const handleDrag = (e) => {
        const rect = this.$refs.volumeSlider.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.setVolume(percentage);
      };

      const stopDrag = () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', stopDrag);
      };

      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', stopDrag);
    },

    handleMouseMove() {
      this.showControls = true;
      this.hideControlsAfterDelay();
    },

    handleMouseLeave() {
      if (this.isPlaying) {
        this.hideControlsAfterDelay();
      }
    },

    handleFullscreenChange() {
      this.isFullscreen = !!document.fullscreenElement;
    },

    handleKeydown(event) {
      if (event.target.closest('.video-player')) {
        switch (event.code) {
          case 'Space':
            event.preventDefault();
            this.togglePlay();
            break;
          case 'ArrowLeft':
            event.preventDefault();
            this.seekTo(this.currentTime - 10);
            break;
          case 'ArrowRight':
            event.preventDefault();
            this.seekTo(this.currentTime + 10);
            break;
          case 'ArrowUp':
            event.preventDefault();
            this.setVolume(Math.min(1, this.volume + 0.1));
            break;
          case 'ArrowDown':
            event.preventDefault();
            this.setVolume(Math.max(0, this.volume - 0.1));
            break;
          case 'KeyM':
            event.preventDefault();
            this.toggleMute();
            break;
          case 'KeyF':
            event.preventDefault();
            this.toggleFullscreen();
            break;
        }
      }
    },

    seekTo(time) {
      this.$refs.videoElement.currentTime = Math.max(0, Math.min(this.duration, time));
      this.currentTime = this.$refs.videoElement.currentTime;
    },

    setVolume(vol) {
      this.volume = vol;
      this.$refs.videoElement.volume = vol;
      if (vol > 0) {
        this.isMuted = false;
        this.$refs.videoElement.muted = false;
      }
    },

    changePlaybackSpeed(speed) {
      this.playbackSpeed = speed;
      this.$refs.videoElement.playbackRate = speed;
      this.showSettings = false;
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    hideControlsAfterDelay() {
      if (this.controlsTimeout) {
        clearTimeout(this.controlsTimeout);
      }
      this.controlsTimeout = setTimeout(() => {
        if (this.isPlaying) {
          this.showControls = false;
        }
      }, 3000);
    }
  }
}
</script>

<style scoped>
.video-player {
  position: relative;
  width: 100%;
  max-width: 800px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.video-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #ff6b9d;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 2;
}

.play-button {
  width: 80px;
  height: 80px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #ff6b9d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.play-button:hover {
  background: white;
  transform: scale(1.1);
  box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
}

.play-button svg {
  width: 30px;
  height: 30px;
  margin-left: 4px;
}

.controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  transform: translateY(100%);
  transition: all 0.3s ease;
  z-index: 3;
}

.controls.visible {
  transform: translateY(0);
}

.progress-container {
  margin-bottom: 12px;
}

.progress-bar {
  position: relative;
  height: 6px;
  cursor: pointer;
  border-radius: 3px;
  overflow: hidden;
}

.progress-track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background: linear-gradient(90deg, #ff6b9d, #ff8fab);
  border-radius: 3px;
  transition: width 0.1s ease;
}

.progress-handle {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.progress-bar:hover .progress-handle {
  opacity: 1;
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.controls-left,
.controls-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-button {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.control-button svg {
  width: 18px;
  height: 18px;
}

.volume-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider {
  position: relative;
  width: 60px;
  height: 4px;
  cursor: pointer;
  border-radius: 2px;
}

.volume-track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.volume-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background: linear-gradient(90deg, #ff6b9d, #ff8fab);
  border-radius: 2px;
  transition: width 0.1s ease;
}

.volume-handle {
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.volume-slider:hover .volume-handle {
  opacity: 1;
}

.time-display {
  color: white;
  font-size: 12px;
  font-weight: 500;
  min-width: 80px;
}

.settings-menu {
  position: absolute;
  bottom: 80px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 8px;
  padding: 8px 0;
  min-width: 100px;
  z-index: 4;
  backdrop-filter: blur(10px);
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.settings-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .controls {
    padding: 16px;
  }

  .controls-left,
  .controls-right {
    gap: 8px;
  }

  .control-button {
    width: 32px;
    height: 32px;
  }

  .control-button svg {
    width: 16px;
    height: 16px;
  }

  .volume-slider {
    width: 40px;
  }

  .time-display {
    font-size: 11px;
    min-width: 70px;
  }
}
</style>