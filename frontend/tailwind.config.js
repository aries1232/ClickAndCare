/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#17de71",
      },
    },
    gridTemplateColumns: {
      // Card grid used by DoctorCard / TopDoctor / Doctors page. 160px min
      // lets two columns sit side-by-side on a ~360px phone, then auto-fills
      // more columns on larger screens.
      auto: "repeat(auto-fill,minmax(160px,1fr))",
    },
  },
  plugins: [],
};
