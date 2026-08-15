// ABOUTME: Click-to-enlarge lightbox for blog post images.
// ABOUTME: Overlays images at native resolution on a dark backdrop with fade transition.

function initLightbox() {
  const prose = document.querySelector<HTMLElement>('.prose');
  if (!prose) return;

  let overlay: HTMLDivElement | null = null;
  let lightboxImage: HTMLImageElement | null = null;

  function close() {
    if (!overlay) return;
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    overlay.setAttribute('aria-hidden', 'true');
  }

  function ensureOverlay() {
    if (overlay && lightboxImage) return { overlay, image: lightboxImage };

    overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Enlarged image');
    overlay.setAttribute('aria-hidden', 'true');
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

    lightboxImage = document.createElement('img');
    Object.assign(lightboxImage.style, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      objectFit: 'contain',
      borderRadius: '4px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    });
    overlay.appendChild(lightboxImage);
    overlay.addEventListener('click', close);
    document.body.appendChild(overlay);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });

    return { overlay, image: lightboxImage };
  }

  prose.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const image = event.target.closest<HTMLImageElement>('img');
    if (!image || !prose.contains(image)) return;

    const lightbox = ensureOverlay();
    lightbox.image.src = image.currentSrc || image.src;
    lightbox.image.alt = image.alt || '';
    lightbox.overlay.style.opacity = '1';
    lightbox.overlay.style.pointerEvents = 'auto';
    lightbox.overlay.setAttribute('aria-hidden', 'false');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLightbox);
} else {
  initLightbox();
}
