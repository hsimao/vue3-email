import { onBeforeUnmount } from 'vue';

const useKeydown = keyCombos => {
  const onKeydown = event => {
    const keyCombo = keyCombos.find(kc => kc.key === event.key);
    if (keyCombo) keyCombo.fn();
  };

  window.addEventListener('keydown', onKeydown);

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
  });
};

export default useKeydown;
