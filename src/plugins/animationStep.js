import triggerEvent from './triggerEvent';
import Animations from '../canvas/Animations';

const animationStep = (event) => {
  if (!event || !event.target) {
    return;
  }

  const el = event.target;

  const { reason } = event.detail;

  if (['next', 'prev'].includes(reason) && !el.querySelector('canvas')) {
    return;
  }

  const canvas = el.querySelector('canvas');

  const animation = Animations[canvas.id];

  if (!animation) {
    return;
  }

  if (animation.completed(reason === 'next')) {
    return;
  }

  animation[reason]();

  triggerEvent(el, 'impress:substep:stepleaveaborted', {
    reason,
    animation,
  });

  // Returning false aborts the stepleave event
  return false;
};

window.impress.addPreStepLeavePlugin(animationStep, 1);
