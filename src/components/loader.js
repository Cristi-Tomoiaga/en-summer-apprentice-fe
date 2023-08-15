export const addLoader = () => {
  const loader = document.querySelector('#loader');
  const header = document.querySelector('#page-header');
  const container = document.querySelector('#content');

  loader.classList.remove('hidden');
  header.classList.add('opacity-25', 'z-[-1]');
  container.classList.add('hidden');
}

export const removeLoader = () => {
  const loader = document.querySelector('#loader');
  const header = document.querySelector('#page-header');
  const container = document.querySelector('#content');

  loader.classList.add('hidden');
  header.classList.remove('opacity-25', 'z-[-1]');
  container.classList.remove('hidden');
}
