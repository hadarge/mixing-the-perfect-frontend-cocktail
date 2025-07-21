# 🧪 Mixing The Perfect Frontend Cocktail

A hands-on example repository from the **Frontendistim Meetup** talk — exploring how **Vue** and **Web Components** can work together, what challenges arise, and how to solve them.

## 🎯 Purpose

This repo demonstrates real-world patterns for exposing  **Vue Components** as **Custom Elements**, showcasing:

- 📦 Importing and rendering custom elements
- 🔁 Data binding
- ⚡  Event communication between Vue and Web Components
- 🔄 Dynamic loading
- 🧩 Micro frontends using Web Components

## 🚀 Quick Start

1. **Clone the repo:**
   ```bash
   git clone https://github.com/hadarge/mixing-the-perfect-frontend-cocktail
   cd mixing-the-perfect-frontend-cocktail
   ```

2. **Install dependencies:**
   ```bash
   
   cd vueApp
   npm i
   
   cd ..

   cd reactApp
   npm i
   
   cd ..
   
   cd angularApp
   npm i
   ```

3. **Start the Vue server:**
   ```bash
   cd vueApp
   npm i
   npm run watch 
   ```

4. **Start the React app:**
   ```bash
   cd reactApp
   npm run dev
   ```
Or

4. **Start the angular app:**
   ```bash
   cd angularApp
   npm run start
   ```

5. **Open in browser:**
- Navigate to [The Vue App](http://localhost:3333)
- Navigate to [The React App](http://localhost:2222)
- Navigate to [The Angular App](http://localhost:4200)

---

## 📁 Structure

```
/vueApp            → Vue host application & WC components exposer module
/react-app         → React host application
/angularApp        → Angular host application
```

---

## 🧠 Topics Covered

- ✅ Defining and registering custom elements
- 🔗 Passing props and attributes to Vue component
- 🔗 Passing props and attributes from React
- 🔗 Passing props and attributes from Angular
- 📡 Listening to events
- 📥 Dynamic import and lazy loading Web Components

---

## 💡 Why Web Components?

Web Components offer framework-agnostic, encapsulated UI building blocks.
When combined with Vue, they unlock powerful micro frontend possibilities and long-term maintainability across diverse codebases.

---

## 🎤 Talk Info

**Frontendistim IL Meetup – July 2025**  
_Speaker: Hadar Geva_  
Topic: **"Mixing The Perfect Frontend Cocktail"**

---

## 🛠️ Tech Stack

- Node 22
- Vue 3.5
- Vite
- Vanilla Web Components (no framework-specific WC library)
- TypeScript

---

## 🤝 Contributing

Feel free to fork, explore, and share your experiments!  
Pull requests are welcome if you’d like to extend this further.

---

## 📄 License

MIT – use freely, build boldly.
