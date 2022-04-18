module.exports = {
  types: [
    { value: 'feature', name: 'feature:     A new feature' },
    { value: 'bugfix', name: 'bugfix:      A bug fix' },
  ],

  allowTicketNumber: true,
  isTicketNumberRequired: true,

  messages: {
    type: "Select the type of change that you're committing:",
    subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer: 'List any ISSUES CLOSED by this change (optional). E.g.: FPS-1, FPS-2:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },

  allowBreakingChanges: ['feature', 'bugfix'],
  skipQuestions: ['scope'],

  subjectLimit: 100,
};
