module.exports = function(eleventyConfig) {
  // Copiar la carpeta 'css' a '_site/assets/css'
  eleventyConfig.addPassthroughCopy("assets/css");

  // Copiar la carpeta 'images' a '_site/assets/images'
  eleventyConfig.addPassthroughCopy("assets/images");

  // Copiar la carpeta 'js' a '_site/assets/js'
  eleventyConfig.addPassthroughCopy("assets/js");

  // Copiar la carpeta 'json' a '_site/assets/json'
  eleventyConfig.addPassthroughCopy("assets/json");

  // Copiar la carpeta 'productos' a '_site/assets/productos'
  eleventyConfig.addPassthroughCopy("productos");

  // Copiar subcarpetas dentro de 'productos' a '_site/assets/productos'
  eleventyConfig.addPassthroughCopy("productos/arranques");
  eleventyConfig.addPassthroughCopy("productos/bandejas");
  eleventyConfig.addPassthroughCopy("productos/blondas");
  eleventyConfig.addPassthroughCopy("productos/bolsas");
  eleventyConfig.addPassthroughCopy("productos/cajas");
  eleventyConfig.addPassthroughCopy("productos/carton");
  eleventyConfig.addPassthroughCopy("productos/cintas");
  eleventyConfig.addPassthroughCopy("productos/cubiertos");
  eleventyConfig.addPassthroughCopy("productos/film");
  eleventyConfig.addPassthroughCopy("productos/folex");
  eleventyConfig.addPassthroughCopy("productos/guantes");
  eleventyConfig.addPassthroughCopy("productos/libreria");
  eleventyConfig.addPassthroughCopy("productos/papel");
  eleventyConfig.addPassthroughCopy("productos/pizzeria");
  eleventyConfig.addPassthroughCopy("productos/rollostermicos");
  eleventyConfig.addPassthroughCopy("productos/sorbetes");
  eleventyConfig.addPassthroughCopy("productos/vasos");

  // Copiar la carpeta 'info' a '_site/assets/info'
  eleventyConfig.addPassthroughCopy("info");
};