// gulp/config.js 

sprites: {
  src: srcAssets + './dev/assets/images/icons/*.png',
  dest: {
    css: srcAssets + './scss/base/',
    image: srcAssets + './dev/assets/images/'
  },
  options: {
    cssName: '_sprites.scss',
    cssFormat: 'css',
    cssOpts: {
      cssClass: function (item) {
        // If this is a hover sprite, name it as a hover one (e.g. 'home-hover' -> 'home:hover')
        if (item.name.indexOf('-hover') !== -1) {
          return '.icon-' + item.name.replace('-hover', ':hover');
          // Otherwise, use the name as the selector (e.g. 'home' -> 'home')
        } else {
          return '.icon-' + item.name;
        }
      }
    },
    imgName: 'icon-sprite.png',
    imgPath: './dev/assets/images/icon-sprite.png'
  }
}