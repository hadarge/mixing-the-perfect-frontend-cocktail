<template>
  <button
      @click="toggleLike"
      :class="[
      'like-button',
      { 'liked': isLiked, 'animate': isAnimating }
    ]"
      :aria-label="isLiked ? 'Unlike' : 'Like'"
  >
    <div class="heart-container">
      <svg
          class="heart-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
      >
        <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            :fill="isLiked ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
      </svg>

      <!-- Floating hearts animation -->
      <div v-if="showFloatingHearts" class="floating-hearts">
        <div
            v-for="i in 3"
            :key="i"
            class="floating-heart"
            :style="{ animationDelay: `${i * 0.1}s` }"
        >
          ❤️
        </div>
      </div>
    </div>

    <span v-if="showCount" class="like-count">{{ likeCount }}</span>
  </button>
</template>

<script>
import {ref} from "vue";

export default {
  name: 'LikeButton',
  props: {
    initialLiked: {
      type: Boolean,
      default: false
    },
    onLikeChange: {
      type: Function
    },
    initialLikeCount: {
      type: Number,
      required: true,
    },
    showCount: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLiked: this.initialLiked,
      likeCount: Number.parseInt(this.initialLikeCount),
      isAnimating: false,
      showFloatingHearts: false
    }
  },
  methods: {
    toggleLike() {
      if (this.disabled) return;

      this.isLiked = !this.isLiked;
      this.likeCount += this.isLiked ? 1 : -1;

      // Trigger animations
      this.isAnimating = true;

      if (this.isLiked) {
        this.showFloatingHearts = true;
        setTimeout(() => {
          this.showFloatingHearts = false;
        }, 1000);
      }

      setTimeout(() => {
        this.isAnimating = false;
      }, 300);

      // Emit event for parent component
      this.$emit('like-changed', {
        liked: this.isLiked,
        count: this.likeCount
      });

      if (this.onLikeChange)
        this.onLikeChange(this.isLiked, this.likeCount);

    }
  },
  watch: {
    initialLiked(newVal) {
      this.isLiked = newVal;
    },
    initialCount(newVal) {
      this.likeCount = newVal;
    }
  }
}
</script>

<style scoped>
.like-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 2px solid #e1e8ed;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  outline: none;
}

.like-button:hover {
  border-color: #ff6b9d;
  background: #fff5f8;
  transform: translateY(-1px);
}

.like-button:active {
  transform: translateY(0);
}

.like-button.liked {
  border-color: #ff6b9d;
  background: linear-gradient(135deg, #ff6b9d, #ff8fab);
  color: white;
}

.like-button.liked:hover {
  background: linear-gradient(135deg, #ff5a8a, #ff7d9f);
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
}

.heart-container {
  position: relative;
  display: flex;
  align-items: center;
}

.heart-icon {
  width: 18px;
  height: 18px;
  color: #657786;
  transition: all 0.2s ease;
}

.like-button:hover .heart-icon {
  color: #ff6b9d;
  transform: scale(1.1);
}

.like-button.liked .heart-icon {
  color: white;
  transform: scale(1);
}

.like-button.animate .heart-icon {
  animation: heartBeat 0.3s ease;
}

.like-count {
  color: #657786;
  font-weight: 600;
  min-width: 20px;
  text-align: left;
  transition: color 0.2s ease;
}

.like-button.liked .like-count {
  color: white;
}

.floating-hearts {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.floating-heart {
  position: absolute;
  font-size: 12px;
  animation: floatUp 1s ease-out forwards;
  left: 50%;
  transform: translateX(-50%);
}

.floating-heart:nth-child(1) {
  left: 40%;
}

.floating-heart:nth-child(2) {
  left: 50%;
}

.floating-heart:nth-child(3) {
  left: 60%;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes floatUp {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(0);
  }
  15% {
    transform: translateX(-50%) translateY(-5px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-30px) scale(0.5);
  }
}

.like-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.like-button:disabled:hover {
  transform: none;
  border-color: #e1e8ed;
  background: white;
}
</style>