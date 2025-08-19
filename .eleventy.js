const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Passthrough de css, js, images, json e info
  eleventyConfig.addPassthroughCopy("assets/css");
  eleventyConfig.addPassthroughCopy("assets/images");
  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("assets/json");
  eleventyConfig.addPassthroughCopy("info");

  // Passthrough de toda la carpeta productos de forma recursiva
  const productosDir = "productos";
  function addPassthroughRecursively(dir) {
    eleventyConfig.addPassthroughCopy(dir);
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      if (entry.isDirectory()) {
        addPassthroughRecursively(path.join(dir, entry.name));
      }
    });
  }
  addPassthroughRecursively(productosDir);
};