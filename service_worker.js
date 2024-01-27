const version = 'credishop-v27.1.24'; // Atualize a versão sempre que houver alterações nos recursos

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(function(registration) {
      console.log('Service Worker registrado com sucesso:', registration);
    })
    .catch(function(error) {
      console.log('Erro ao registrar o Service Worker:', error);
    });
}

const resources = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(version).then(function(cache) {
      return cache.addAll(resources);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== version;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        const responseClone = response.clone();

        caches.open(version).then(function(cache) {
          cache.put(event.request, responseClone);
        });

        return response;
      })
      .catch(function() {
        return caches.match(event.request).then(function(cachedResponse) {
          if (cachedResponse) {
            return cachedResponse;
          } else {
            return new Response('Offline', { status: 500, statusText: 'Offline' });
          }
        });
      })
  );
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevenir a exibição automática do prompt
  event.preventDefault();
  // Manter o evento para poder usá-lo posteriormente
  deferredPrompt = event;

  // Exibir seu próprio botão ou elemento para chamar o prompt de instalação
  // Aqui você pode mostrar um modal, um botão flutuante, etc.
  // Exemplo com um botão:
  const installButton = document.getElementById('install-button');

  // Seu elemento de botão deve ser exibido quando você quiser permitir a instalação
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    // Chamar o prompt de instalação quando o botão for clicado
    deferredPrompt.prompt();

    // Aguardar o usuário agir no prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuário aceitou a instalação');
      } else {
        console.log('Usuário recusou a instalação');
      }

      // Limpar o prompt diferido
      deferredPrompt = null;
    });
  });
});
