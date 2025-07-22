import {defineCustomElement} from 'vue'

// Import the Vue component.
import VideoPlayerCe from '../components/VideoPlayer.ce.vue'

// Turn the Vue component into a Custom Element class.
export const SomeElement = defineCustomElement(VideoPlayerCe)

export const defineVideoPlayer = () => {
    // Remember to register the element class with the browser.
    customElements.define('video-player', SomeElement)
}