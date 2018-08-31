import { tween, spring } from 'popmotion';
import {
  drawBead,
  drawBeadNh2,
  drawEnzyme,
  BEAD_RADIUS,
} from './drawFunctions';

class AnimationSlide {
  constructor(buffer) {
    this.stepIndex = 0;
    this.steps = [];
    this.c = buffer.getContext('2d');
    this.c.scale(2, 2);
    this.animationStatus = 'start';
  }

  navigate(nextOrPrev = true) {
    const {
      from, to, update, duration, animate, subscription,
    } = this.steps[
      this.stepIndex
    ];

    if (subscription) {
      subscription.stop();
    }

    this.steps[this.stepIndex].subscription = animate({
      nextOrPrev,
      to,
      from,
    });
  }
  maybeReturn(nextOrPrev) {
    if (this.completed()) {
      this.endOfAnimations = 0;
    }
  }
  maybeNavigate(nextOrPrev) {
    this.navigate(nextOrPrev);
  }
  next() {
    if (this.animationStatus === 'end') {
      this.stepIndex += 1;
      this.animationStatus = 'end';
    } else if (this.animationStatus === 'start') {
      this.animationStatus = 'end';
    }
    this.maybeNavigate(true);
  }
  prev() {
    if (this.animationStatus === 'start') {
      this.stepIndex -= 1;
      this.animationStatus = 'start';
    } else if (this.animationStatus === 'end') {
      this.animationStatus = 'start';
    }
    this.maybeNavigate(false);

    // if (this.animationStatus === 'start' && !this.completed(false)) {
    //   console.log('here');
    //   this.stepIndex -= 1;
    //   this.animationStatus = 'end';
    // }
  }

  completed(nextOrPrev) {
    if (
      this.stepIndex === 0 &&
      this.animationStatus === 'start' &&
      !nextOrPrev
    ) {
      return true;
    }
    if (
      this.stepIndex === this.steps.length - 1 &&
      this.animationStatus === 'end' &&
      nextOrPrev
    ) {
      return true;
    }
    return false;
  }

  render() {
    this.c.clearRect(0, 0, _w, _h);
    if (this.steps[this.stepIndex].renderAllPrevious) {
      this.renderAllPrevious();
    }
    this.steps[this.stepIndex].render();
  }

  renderAllPrevious = () => {
    for (let i = 0; i < this.stepIndex; i += 1) {
      this.steps[i].render();
    }
  };
}

class BeadAnimationSlide extends AnimationSlide {
  constructor(buffer) {
    buffer.width = 2 * _w;
    buffer.height = 2 * _h;
    buffer.style.width = `${_w}px`;
    buffer.style.height = `${_h}px`;
    super(buffer);
    this.beadX = 0;
    this.beadY = _h / 2;
    this.nh2Radius = _w;
    this.nh2Radius2 = _w;
    this.enzRadius = _w;
    this.steps = [
      /* Move bead from left to right */
      {
        from: this.beadX,
        to: _w / 2,
        render: () => {
          drawBead({ x: this.beadX, y: this.beadY, c: this.c });
        },
        duration: 500,
        animate: ({ nextOrPrev, to, from }) =>
          spring({
            from: this.beadX,
            to: nextOrPrev ? to : from,
            duration: 500,
            mass: 3,
          }).start((value) => {
            this.beadX = value;
            this.render();
          }),
      },
      /* decrease radius of imobilized NH2 */
      {
        from: this.nh2Radius,
        to: BEAD_RADIUS,
        renderAllPrevious: true,

        render: () => {
          drawBeadNh2({
            r: this.nh2Radius,
            c: this.c,
            x: this.beadX,
            y: this.beadY,
          });
        },
        duration: 500,
        animate: ({ nextOrPrev, to, from }) =>
          tween({
            from: this.nh2Radius,
            to: nextOrPrev ? to : from,
            duration: 500,
          }).start((value) => {
            this.nh2Radius = value;
            this.render(value);
          }),
      },
      /* decrease radius of second imobilized NH2 */
      {
        from: this.nh2Radius2,
        to: BEAD_RADIUS + 65,
        renderAllPrevious: true,

        render: () => {
          drawBeadNh2({
            r: this.nh2Radius2,
            c: this.c,
            x: this.beadX,
            y: this.beadY,
            linkerColor: 'green',
          });
        },
        duration: 500,
        animate: ({ nextOrPrev, to, from }) =>
          tween({
            from: this.nh2Radius2,
            to: nextOrPrev ? to : from,
            duration: 500,
          }).start((value) => {
            this.nh2Radius2 = value;
            this.render(value);
          }),
      },
      /* decrease radius of second imobilized enz */
      {
        from: this.enzRadius,
        to: BEAD_RADIUS + 130,
        renderAllPrevious: true,

        render: () => {
          drawEnzyme({
            r: this.enzRadius,
            c: this.c,
            x: this.beadX,
            y: this.beadY,
            linkerColor: 'black',
          });
        },
        duration: 500,
        animate: ({ nextOrPrev, to, from }) =>
          tween({
            from: this.enzRadius,
            to: nextOrPrev ? to : from,
            duration: 500,
          }).start((value) => {
            this.enzRadius = value;
            this.render(value);
          }),
      },
      {
        from: _h / 2,
        to: -_h,
        renderAllPrevious: true,
        render: () => {},
        duration: 500,
        animate: ({ nextOrPrev, to, from }) =>
          tween({
            from: this.beadY,
            to: nextOrPrev ? to : from,
            duration: 500,
          }).start((value) => {
            this.beadY = value;
            this.render();
          }),
      },
    ];
  }
}

const animations = {
  beadAnimation: new BeadAnimationSlide(
    document.getElementById('beadAnimation')
  ),
};

const triggerEvent = (el, eventName, detail) => {
  const event = document.createEvent('CustomEvent');
  event.initCustomEvent(eventName, true, true, detail);
  el.dispatchEvent(event);
};

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

  const animation = animations[canvas.id];

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

const cssTransitionStep = (event) => {
  if (!event || !event.target) {
    return;
  }

  const el = event.target;

  const { reason } = event.detail;

  const stepLength = el.getAttribute('data-steps');

  if (['next', 'prev'].includes(reason) && !stepLength) {
    return;
  }

  const currentStep = el.getAttribute('data-step') || 0;
  const nextStep = Number(currentStep) + (reason === 'next' ? 1 : -1);

  if (nextStep > stepLength || nextStep < 0) {
    return;
  }

  el.setAttribute('data-step', nextStep);

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
window.impress.addPreStepLeavePlugin(animationStep, 1);
