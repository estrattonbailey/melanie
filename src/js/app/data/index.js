export default [
  {
    id: 1,
    prompt: `Hey there. What brings you to this corner of the web?`,
    answers: [
      {
        value: 'Who are you?',
        next: 2
      },
      {
        value: `I'm hiring.`,
        next: 3
      },
      {
        value: `It's your mom.`,
        next: 4
      },
      {
        value: `Funny jokes.`,
        next: 5
      }
    ]
  },

  {
    id: 2,
    prompt: `I'm Melanie – a freelance creator & proud Iowan craving ALL the BLTs.`,
    answers: [
      {
        value: `What sort of creator?`,
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
    prompt: `Rad. Can I show you some of my work?`,
    answers: [
      {
        value: `Yes, please!`,
        next: '/design'
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
    prompt: `Hi Mom. I love you!`,
    answers: [
      {
        value: `Acutally I'm not your mom.`,
        next: 9
      },
      {
        value: `It's cold. Put on a jacket.`,
        next: 15
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
        next: 'https://media.giphy.com/media/10tD7GP9lHfaPC/giphy.gif'
      },
    ]
  },

  {
    id: 6,
    prompt: `Primarily a graphic designer, I was most recently an art director at an experiential agency.`,
    answers: [
      {
        value: `Could I see some work?`,
        next: '/experiential'
      },
      {
        value: `Why experiential?`,
        next: 11
      },
    ]
  },

  {
    id: 7,
    prompt: `You tell me.`,
    answers: [
      {
        value: `Berry Lemon Tostito`,
        next: 'https://media3.giphy.com/media/3xz2BumkfpAjkjQloc/giphy.gif'
      },
      {
        value: `Bocce Liver Tornado`,
        next: 'https://media.giphy.com/media/SXeezvYc8uRUc/giphy.gif'
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
        next: 'https://media.giphy.com/media/Y8cdPle4eIyPu/giphy.gif'
      },
    ]
  },

  {
    id: 11,
    prompt: `Which is more fun— a video of a party or an ACTUAL party?`,
    answers: [
      {
        value: `Let's see these "parties"!`,
        next: '/experiential'
      },
      {
        value: `I'm intrigued. Can I email you?`,
        next: '/contact'
      },
    ]
  },
  {
    id: 15,
    prompt: `It is you, Mom!`,
    answers: [
      {
        value: `Yippee!`,
        next: 'https://media.giphy.com/media/krewXUB6LBja/giphy.gif'
      },
    ]
  }
]
