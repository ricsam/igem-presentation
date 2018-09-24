import $ from 'jquery';
import triggerEvent from './triggerEvent';
import get from 'lodash/get';

let currentStep = null;
const setCurrentStep = (step) => {
  currentStep = step;
  $('#current-slide').text(`#${step.id}`);
  $('#current-slide-title').text(step.title);
};

setCurrentStep({
  id: $('.step.active').attr('id'),
  title: $('.step.active').attr('data-title'),
});

const cssTransitionStep = (event) => {
  if (!event || !event.target) {
    return undefined;
  }

  console.log(event.detail.next);

  const id = get(event, 'detail.next.id');
  setCurrentStep({
    id,
    title: $(event.detail.next).attr('data-title'),
  });
};

window.impress.addPreStepLeavePlugin(cssTransitionStep, 1);
