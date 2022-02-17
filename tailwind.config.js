module.exports = {
  content: [
    './build/*.html',
    './scripts/*.{js,jsx,ts,tsx,vue}',
  ],
  plugins: [],
  theme: {
    extend: {
      maxWidth: {
        '1/2': '50%',
        '1/3': '33.33333%',
      }
    }
  }
};
