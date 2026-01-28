export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF6A00",
        "primary-dark": "#E65C00",
        "primary-light": "#FFB74D",
        "primary-bg": "#FFF8F0",

        accent: "#FFD700",

        neutral: "#FFFFFF",
        dark: "#1A1A1A",
        gray: "#6B7280",
        "gray-light": "#F3F4F6",
        "gray-dark": "#374151",
        "brand-dark": "#6b2400",
        "brand-orange": "#f76822",
      },

      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #000000 0%, #FF6A00 100%)",
        "gradient-card": "linear-gradient(145deg, #FFB74D, #FF6A00)",
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        fancy: ["Playfair Display", "serif"],
        kaushan: ['"Kaushan Script"', 'cursive'],
      },

      boxShadow: {
        card: "0 10px 25px rgba(0,0,0,0.15)",
        hero: "0 10px 40px rgba(0,0,0,0.3)",
      },

      borderRadius: {
        sm: "0.5rem",
        md: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },

      transitionDuration: {
        400: "400ms",
        600: "600ms",
      },

      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};
