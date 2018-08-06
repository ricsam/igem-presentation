import { tween } from 'popmotion';
import { drawBead, drawBeadNh2 } from './drawFunctions';

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
    this.steps[this.stepIndex].render();
  }
}

class BeadAnimationSlide extends AnimationSlide {
  constructor(buffer) {
    super(buffer);
    this.beadX = 0;
    this.beadY = _h / 2;
    this.nh2Radius = _w;
    this.steps = [
      /* Move bead from left to right */
      {
        from: this.beadX,
        to: _w / 2,
        render: () => {
          drawBead({ x: this.beadX, y: _h / 2, c: this.c });
        },
        duration: 500,
        animate: ({ nextOrPrev, to, from }) =>
          tween({
            from: this.beadX,
            to: nextOrPrev ? to : from,
            duration: 500,
          }).start((value) => {
            this.beadX = value;
            this.render();
          }),
      },
      /* decrease radius of imobilized NH2 */
      {
        from: this.nh2Radius,
        to: 125,
        render: () => {
          drawBead({ x: this.beadX, y: _h / 2, c: this.c });
          drawBeadNh2({ r: this.nh2Radius, c: this.c });
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
      {
        from: _h / 2,
        to: 0,
        render: () => {
          drawBead({ x: this.beadX, y: this.beadY, c: this.c });
          drawBeadNh2({ r: this.nh2Radius, c: this.c, x: this.beadX, y: this.beadY });
        },
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

window.impress.addPreStepLeavePlugin(animationStep, 1);