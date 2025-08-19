const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Passthrough de css, js, images, json e info
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets/css");
  eleventyConfig.addPassthroughCopy("assets/images");
  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("assets/json");
  eleventyConfig.addPassthroughCopy("info");

  // Carpeta de productos según Netlify CMS
  const productosDir = "src/products";

  // Función segura para copiar recursivamente, solo si existe
  function addPassthroughRecursively(dir) {
    if (!fs.existsSync(dir)) {
      console.warn(`⚠️  Carpeta no encontrada: ${dir}. Se omite.`);
      return;
    }

    eleventyConfig.addPassthroughCopy(dir);

    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      if (entry.isDirectory()) {
        addPassthroughRecursively(path.join(dir, entry.name));
      }
    });
  }

  addPassthroughRecursively(productosDir);
};