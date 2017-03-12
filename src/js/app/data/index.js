export default [
  {
    id: 1,
    prompt: `Hi! What brings you to this neck of the web?`,
    answers: [
      {
        value: 'Who r u?',
        next: 2
      },
      {
        value: `I'm hiring.`,
        next: 3
      },
      {
        value: `It's your mother.`,
        next: 4
      },
      {
        value: `Funny jokes, plz.`,
        next: 5
      }
    ]
  },

  {
    id: 2,
    prompt: `I'm melanie – a graphic designer working in experiential marketing & proud Iowan trying to eat ALL the BLTs.`,
    answers: [
      {
        value: `What's experiential?`,
        next: 6
      },
      {
        value: `What's a BLT?`,
        next: 7
      },
    ]
  },

  {
    id: 3,
    prompt: `Rad. Can I show you some projects I've worked on?`,
    answers: [
      {
        value: `Yes, please!`,
        next: '/work'
      },
      {
        value: `Nah, tell me about you.`,
        next: '/about'
      },
      {
        value: `I'll email you instead.`,
        next: '/contact'
      },
    ]
  },

  {
    id: 4,
    prompt: `Hi mom. I love you!`,
    answers: [
      {
        value: `jk, not your mom`,
        next: 9
      },
    ]
  },

  {
    id: 5,
    prompt: `What's funnier than a rhetorical question?`,
    answers: [
      {
        value: `Yes`,
        next: 10
      },
      {
        value: `No`,
        next: 'https://media.giphy.com/media/P2Hy88rAjQdsQ/giphy.gif'
      },
    ]
  },

  {
    id: 6,
    prompt: `Experiential marketing engages directly with consumers, inviting them to particpate in the evolution of a brand.`,
    answers: [
      {
        value: `Sounds cool. What have you done?`,
        next: '/work'
      },
      {
        value: `Why do you like it?`,
        next: 11
      },
    ]
  },

  {
    id: 7,
    prompt: `You tell me.`,
    answers: [
      {
        value: `Beef Liver Toast`,
        next: 'https://media.giphy.com/media/oFOs10SJSnzos/giphy.gif'
      },
      {
        value: `Berry Lemon Tart`,
        next: 'https://media.giphy.com/media/3o7TKwmnDgQb5jemjK/giphy.gif'
      },
      {
        value: `Bacon Lettuce Tomato`,
        next: 'https://media.giphy.com/media/fqzxcmlY7opOg/giphy.gif'
      },
    ]
  },

  {
    id: 9,
    prompt: `Clicking for fun? Good luck with this one.`,
    answers: [
      {
        value: `Blue Pill`,
        next: 'https://media.giphy.com/media/G7GNoaUSH7sMU/giphy.gif'
      },
      {
        value: `Red Pill`,
        next: 'https://media.giphy.com/media/UjujGY3mA3Jle/giphy.gif'
      },
    ]
  },

  {
    id: 10,
    prompt: `Pancakes or waffles?`,
    answers: [
      {
        value: `French Toast`,
        next: 'https://media.giphy.com/media/14nb6TlIRlaN1u/giphy.gif'
      },
    ]
  },

  {
    id: 11,
    prompt: `I like experiential because it's just super cool, okay?`,
    answers: [
      {
        value: `What are your favorite projects?`,
        next: 14
      },
      {
        value: `I have questions! Can I email you?`,
        next: '/contact'
      },
    ]
  },

  {
    id: 14,
    prompt: `I love the work I've done, but these projects deserve some serious props.`,
    answers: [
      {
        value: `project 1`,
        next: 'https://twitter.com'
      },
      {
        value: `project 2`,
        next: 'https://twitter.com'
      },

      {
        value: `project 3`,
        next: 'https://twitter.com'
      },
    ]
  },
]
