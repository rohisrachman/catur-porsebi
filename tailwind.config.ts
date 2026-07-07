import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#07070b",
        charcoal: "#10121a",
        royal: "#b78b2b",
        bone: "#f4ead8",
        electric: "#38bdf8",
        violetfire: "#8b5cf6"
      },
      boxShadow: {
        gold: "0 0 28px rgba(245, 190, 75, 0.35)",
        electric: "0 0 30px rgba(56, 189, 248, 0.24)"
      },
      backgroundImage: {
        "royal-radial": "radial-gradient(circle at top left, rgba(183,139,43,.22), transparent 30%), radial-gradient(circle at 80% 20%, rgba(56,189,248,.14), transparent 28%), linear-gradient(135deg, #07070b, #10121a 55%, #050509)"
      },
      animation: {
        "slow-pulse": "slowPulse 2.4s ease-in-out infinite",
        "crown-pop": "crownPop .9s ease both"
      },
      keyframes: {
        slowPulse: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 18px rgba(56, 189, 248, .18)" },
          "50%": { opacity: ".82", boxShadow: "0 0 36px rgba(56, 189, 248, .42)" }
        },
        crownPop: {
          "0%": { transform: "translateY(10px) scale(.92)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
