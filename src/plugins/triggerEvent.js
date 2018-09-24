const triggerEvent = (el, eventName, detail) => {
  const event = document.createEvent('CustomEvent');
  event.initCustomEvent(eventName, true, true, detail);
  el.dispatchEvent(event);
};

export default triggerEvent;
