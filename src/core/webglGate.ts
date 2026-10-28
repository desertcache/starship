import WebGL from 'three/examples/jsm/capabilities/WebGL.js';

/**
 * No WebGL 2, no ship. Without this, index.html's "Building the ship" line would wait forever while
 * the renderer throws, so the line gives way to three.js's own no-WebGL message instead. main.ts
 * imports this module first, so the check runs before the world modules start building textures.
 * The error listener covers a browser that reports WebGL 2 and then can't create the context.
 */
function showNoWebGL(): void {
  const boot = document.getElementById('boot');
  if (!boot) return; // the first frame already drew, so WebGL works
  const message = WebGL.getWebGL2ErrorMessage();
  message.style.width = 'min(400px, calc(100% - 32px))';
  boot.replaceWith(message);
}

if (!WebGL.isWebGL2Available()) showNoWebGL();
window.addEventListener('error', (e) => {
  if (/WebGL/i.test(String(e.message))) showNoWebGL();
});
