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
      // Card grid used by DoctorCard on tablet+. 160px floor matches the
      // original desktop layout. Mobile uses an explicit `grid-cols-3` on
      // the parent (see Doctors.jsx / TopDoctor.jsx) to guarantee 3-up
      // tiles without affecting desktop column counts.
      auto: "repeat(auto-fill,minmax(160px,1fr))",
    },
  },
  plugins: [],
};
