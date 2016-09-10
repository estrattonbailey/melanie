export default [
  {
    prompt: `Hi :) welcome to my site. What are you looking for?`,
    answers: [
      {
        value: 'my work',
        next: 'Why?' 
      },
      {
        value: 'funny jokes',
        next: `What's funnier than a rhetoical question?` 
      },
      {
        value: 'GIFs',
        next: '/gifs' 
      }
    ]
  },
  {
    prompt: `Why?`,
    answers: [
      {
        value: 'I want to hire you!',
        next: 'Mom?' 
      },
      {
        value: 'just curious',
        next: 'Mom?' 
      }
    ]
  },
  {
    prompt: `What's funnier than a rhetorical question?`,
    answers: [
      {
        value: 'Yes',
        next: 'Hi :) welcome to my site. What are you looking for?' 
      },
      {
        value: 'No',
        next: 'Hi :) welcome to my site. What are you looking for?' 
      }
    ]
  },
  {
    prompt: `Mom?`,
    answers: [
      {
        value: 'I love you, honey!',
        next: 'https://media.giphy.com/media/FGTVmzksb2j0k/giphy.gif' 
      },
      {
        value: 'what, no',
        next: '/work' 
      }
    ]
  },
]
