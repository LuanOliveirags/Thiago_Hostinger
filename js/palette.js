// PALETTE SELECTOR: Troca dinâmica de cores do site
const palettes = {
  default: {
    '--primary': '#ffb6c1', // rosa claro
    '--primary-dark': '#e85ca8',
    '--primary-light': '#ffe0ef',
    '--accent': '#e85ca8',
    '--dark': '#181818',
    '--light': '#fff0f6',
  },
  rosa: {
    '--primary': '#ffb6c1',
    '--primary-dark': '#e85ca8',
    '--primary-light': '#ffe0ef',
    '--accent': '#e85ca8',
    '--dark': '#181818',
    '--light': '#fff0f6',
  },
  lilas: {
    '--primary': '#d6a4ff',
    '--primary-dark': '#a259ff',
    '--primary-light': '#f3e6ff',
    '--accent': '#e85ca8',
    '--dark': '#181818',
    '--light': '#f6f0ff',
  },
  coral: {
    '--primary': '#ff8fa3',
    '--primary-dark': '#ff5e62',
    '--primary-light': '#ffd6e0',
    '--accent': '#e85ca8',
    '--dark': '#181818',
    '--light': '#fff0f6',
  }
};

function setPalette(name) {
  const palette = palettes[name] || palettes.default;
  Object.entries(palette).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  document.querySelectorAll('.palette-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.palette === name)
  );
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.palette-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      setPalette(btn.dataset.palette);
    });
  });
  setPalette('default');
});
