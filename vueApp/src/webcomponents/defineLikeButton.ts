import {defineCustomElement} from 'vue'

// Import the Vue component.
import LikeButton from '../components/LikeButton.ce.vue'

// Turn the Vue component into a Custom Element class.
export const SomeElement = defineCustomElement(LikeButton)

export const defineLikeButton = () => {
    // Remember to register the element class with the browser.
    customElements.define('like-button', SomeElement)
}