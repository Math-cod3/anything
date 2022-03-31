const emit = (target, eventName, detail) => {
  const event = new CustomEvent(eventName, {
    bubbles: true,
    detail,
  });

  target.dispatchEvent(event);
};

export { emit };
