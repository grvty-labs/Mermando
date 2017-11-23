import anime from 'animejs';

const effects = {
  Hapi: {
    animeOpts: {
      duration(t, i) {
        return 600 + (i * 75);
      },
      easing: 'easeOutExpo',
      delay(t, i) {
        return i * 50;
      },
      opacity: {
        value: [0, 1],
        easing: 'linear',
      },
      scale: [0, 1],
    },
  },
  Amun: {
    // Sort target elements function.
    sortTargetsFn(a, b) {
      const aBounds = a.getBoundingClientRect();
      const bBounds = b.getBoundingClientRect();

      return (aBounds.left - bBounds.left) || (aBounds.top - bBounds.top);
    },
    animeOpts: {
      duration(t, i) {
        return 500 + (i * 50);
      },
      easing: 'easeOutExpo',
      delay(t, i) {
        return i * 20;
      },
      opacity: {
        value: [0, 1],
        duration(t, i) {
          return 250 + (i * 50);
        },
        easing: 'linear',
      },
      translateY: [400, 0],
    },
  },
  Kek: {
    sortTargetsFn(a, b) {
      return b.getBoundingClientRect().left - a.getBoundingClientRect().left;
    },
    animeOpts: {
      duration: 800,
      easing: [0.1, 1, 0.3, 1],
      delay(t, i) {
        return i * 20;
      },
      opacity: {
        value: [0, 1],
        duration: 600,
        easing: 'linear',
      },
      translateX: [-500, 0],
      rotateZ: [15, 0],
    },
  },
  Isis: {
    animeOpts: {
      duration: 900,
      elasticity: 500,
      delay(t, i) {
        return i * 15;
      },
      opacity: {
        value: [0, 1],
        duration: 300,
        easing: 'linear',
      },
      translateX() {
        return [anime.random(0, 1) === 0 ? 100 : -100, 0];
      },
      translateY() {
        return [anime.random(0, 1) === 0 ? 100 : -100, 0];
      },
    },
  },
  Montu: {
    perspective: 800,
    origin: '50% 0%',
    animeOpts: {
      duration: 1500,
      elasticity: 400,
      delay(t, i) {
        return i * 75;
      },
      opacity: {
        value: [0, 1],
        duration: 1000,
        easing: 'linear',
      },
      rotateX: [-90, 0],
    },
  },
  Osiris: {
    perspective: 3000,
    animeOpts: {
      duration() {
        return anime.random(500, 1000);
      },
      easing: [0.2, 1, 0.3, 1],
      delay(t, i) {
        return i * 50;
      },
      opacity: {
        value: [0, 1],
        duration: 700,
        easing: 'linear',
      },
      translateZ: {
        value: [-3000, 0],
        duration: 1000,
      },
      rotateY: ['-1turns', 0],
    },
  },
  Satet: {
    animeOpts: {
      duration: 800,
      elasticity: 600,
      delay(t, i) {
        return i * 100;
      },
      opacity: {
        value: [0, 1],
        duration: 600,
        easing: 'linear',
      },
      scaleX: {
        value: [0.4, 1],
      },
      scaleY: {
        value: [0.6, 1],
        duration: 1000,
      },
    },
  },
  Atum: {
    sortTargetsFn(a, b) {
      const docScrolls = { top: document.body.scrollTop + document.documentElement.scrollTop };
      const y1 = window.innerHeight + docScrolls.top;
      const aBounds = a.getBoundingClientRect();
      const ay1 = aBounds.top + docScrolls.top + (aBounds.height / 2);
      const bBounds = b.getBoundingClientRect();
      const by1 = bBounds.top + docScrolls.top + (bBounds.height / 2);

      return Math.abs(y1 - ay1) - Math.abs(y1 - by1);
    },
    perspective: 1000,
    origin: '50% 0%',
    animeOpts: {
      duration: 800,
      easing: [0.1, 1, 0.3, 1],
      delay(t, i) {
        return i * 35;
      },
      opacity: {
        value: [0, 1],
        duration: 600,
        easing: 'linear',
      },
      translateX: [100, 0],
      translateY: [-100, 0],
      translateZ: [400, 0],
      rotateZ: [10, 0],
      rotateX: [75, 0],
    },
  },
  Ra: {
    origin: '50% 0%',
    animeOpts: {
      duration: 500,
      easing: 'easeOutBack',
      delay(t, i) {
        return i * 100;
      },
      opacity: {
        value: [0, 1],
        easing: 'linear',
      },
      translateY: [400, 0],
      scaleY: [
        {
          value: [3, 0.6], delay(t, i) { return (i * 100) + 120; }, duration: 300, easing: 'easeOutExpo',
        },
        { value: [0.6, 1], duration: 1400, easing: 'easeOutElastic' },
      ],
      scaleX: [
        {
          value: [0.9, 1.05], delay(t, i) { return (i * 100) + 120; }, duration: 300, easing: 'easeOutExpo',
        },
        { value: [1.05, 1], duration: 1400, easing: 'easeOutElastic' },
      ],
    },
  },
  Sobek: {
    animeOpts: {
      duration: 600,
      easing: 'easeOutExpo',
      delay(t, i) {
        return i * 100;
      },
      opacity: {
        value: [0, 1],
        duration: 100,
        easing: 'linear',
      },
      translateX(t, i) {
        const docScrolls = { left: document.body.scrollLeft + document.documentElement.scrollLeft };
        const x1 = (window.innerWidth / 2) + docScrolls.left;
        const tBounds = t.getBoundingClientRect();
        const x2 = tBounds.left + docScrolls.left + (tBounds.width / 2);

        return [x1 - x2, 0];
      },
      translateY(t, i) {
        const docScrolls = { top: document.body.scrollTop + document.documentElement.scrollTop };
        const y1 = window.innerHeight + docScrolls.top;
        const tBounds = t.getBoundingClientRect();
        const y2 = tBounds.top + docScrolls.top + (tBounds.height / 2);

        return [y1 - y2, 0];
      },
      rotate(t, i) {
        const x1 = window.innerWidth / 2;
        const tBounds = t.getBoundingClientRect();
        const x2 = tBounds.left + (tBounds.width / 2);

        return [x2 < x1 ? 90 : -90, 0];
      },
      scale: [0, 1],
    },
  },
  Ptah: {
    itemOverflowHidden: true,
    sortTargetsFn(a, b) {
      return b.getBoundingClientRect().left - a.getBoundingClientRect().left;
    },
    origin: '100% 0%',
    animeOpts: {
      duration: 500,
      easing: 'easeOutExpo',
      delay(t, i) {
        return i * 20;
      },
      opacity: {
        value: [0, 1],
        duration: 400,
        easing: 'linear',
      },
      rotateZ: [45, 0],
    },
  },
  Bes: {
    revealer: true,
    revealerOrigin: '100% 50%',
    animeRevealerOpts: {
      duration: 800,
      delay(t, i) {
        return i * 75;
      },
      easing: 'easeInOutQuart',
      scaleX: [1, 0],
    },
    animeOpts: {
      duration: 800,
      easing: 'easeInOutQuart',
      delay(t, i) {
        return i * 75;
      },
      opacity: {
        value: [0, 1],
        easing: 'linear',
      },
      scale: [0.8, 1],
    },
  },
  Seker: {
    revealer: true,
    revealerOrigin: '50% 100%',
    animeRevealerOpts: {
      duration: 500,
      delay(t, i) {
        return i * 50;
      },
      easing: [0.7, 0, 0.3, 1],
      translateY: [100, 0],
      scaleY: [1, 0],
    },
    animeOpts: {
      duration: 500,
      easing: [0.7, 0, 0.3, 1],
      delay(t, i) {
        return i * 50;
      },
      opacity: {
        value: [0, 1],
        duration: 400,
        easing: 'linear',
      },
      translateY: [100, 0],
      scale: [0.8, 1],
    },
  },
  Nut: {
    revealer: true,
    revealerColor: '#1d1d1d',
    itemOverflowHidden: true,
    animeRevealerOpts: {
      easing: 'easeOutCubic',
      delay(t, i) {
        return i * 100;
      },
      translateX: [
        { value: ['101%', '0%'], duration: 400 },
        { value: ['0%', '-101%'], duration: 400 },
      ],
    },
    animeOpts: {
      duration: 900,
      easing: 'easeOutCubic',
      delay(t, i) {
        return 400 + (i * 100);
      },
      opacity: {
        value: 1,
        duration: 1,
        easing: 'linear',
      },
      scale: [0.8, 1],
    },
  },
  Shu: {
    lineDrawing: true,
    animeLineDrawingOpts: {
      duration: 800,
      delay(t, i) {
        return i * 150;
      },
      easing: 'easeInOutSine',
      strokeDashoffset: [anime.setDashoffset, 0],
      opacity: [
        { value: [0, 1] },
        {
          value: [1, 0], duration: 200, easing: 'linear', delay: 500,
        },
      ],
    },
    animeOpts: {
      duration: 800,
      easing: [0.2, 1, 0.3, 1],
      delay(t, i) {
        return (i * 150) + 800;
      },
      opacity: {
        value: [0, 1],
        easing: 'linear',
      },
      scale: [0.5, 1],
    },
  },
};

export default effects;
