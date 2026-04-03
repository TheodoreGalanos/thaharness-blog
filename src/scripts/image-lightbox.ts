// ABOUTME: Click-to-enlarge lightbox for blog post images.
// ABOUTME: Overlays images at native resolution on a dark backdrop with fade transition.

function initLightbox() {
  const overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '9999',
    background: 'rgba(17, 17, 19, 0.92)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: '0',
    pointerEvents: 'none',
    transition: 'opacity 0.2s ease',
    cursor: 'zoom-out',
    padding: '2rem',
  });

  const img = document.createElement('img');
  Object.assign(img.style, {
    maxWidth: '90vw',
    maxHeight: '90vh',
    objectFit: 'contain',
    borderRadius: '4px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
  });
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  function open(src: string, alt: string) {
    img.src = src;
    img.alt = alt;
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
  }

  function close() {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
  }

  overlay.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Attach to all images inside prose content
  const prose = document.querySelector('.prose');
  if (!prose) return;

  prose.querySelectorAll('img').forEach((image) => {
    const el = image as HTMLImageElement;
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', () => {
      open(el.src, el.alt || '');
    });
  });
}

document.addEventListener('DOMContentLoaded', initLightbox);
