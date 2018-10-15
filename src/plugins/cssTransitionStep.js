import $ from 'jquery';
import triggerEvent from './triggerEvent';

if (process.env.NODE_ENV === 'production') {
  window.localStorage.setItem('local-step', 0);
}

{
  const initSlide = window.localStorage.getItem('local-step') || 0;
  $('[data-steps]').attr('data-step', initSlide);
  document.getElementById('current-subslide').innerHTML = initSlide;
}

const cssTransitionStep = (event) => {
  if (!event || !event.target) {
    return undefined;
  }

  const el = event.target;

  const { reason } = event.detail;

  const stepLength = el.getAttribute('data-steps');

  if (['next', 'prev'].includes(reason) && !stepLength) {
    return undefined;
  }

  const currentStep = el.getAttribute('data-step') || 0;
  const nextStep = Number(currentStep) + (reason === 'next' ? 1 : -1);

  if (nextStep > stepLength || nextStep < 0) {
    return undefined;
  }

  window.localStorage.setItem('local-step', nextStep);
  el.setAttribute('data-step', nextStep);

  document.getElementById('current-subslide').innerHTML = nextStep;

  triggerEvent(el, 'impress:substep:stepleaveaborted', {
    reason,
    step: {
      el,
      nextStep,
    },
  });

  // Returning false aborts the stepleave event
  return false;
};

window.impress.addPreStepLeavePlugin(cssTransitionStep, 1);
