#!/usr/bin/env node
import arg from 'arg'
import {
  description as createDescription,
  createCli,
  createOptions
} from './create.js'
import {
  description as migrateDescription,
  migrateCli,
  migrateOptions
} from './migrate.js'

const argsHelp = () => {
  return `
gracile [create|migrate]

(append --help for the single commands, e.g. 'gracile create --help')

create: ${createDescription}
migrate: ${migrateDescription}
`
}

const printhelp = (error = false) => {
  if (error) {
    console.log('Argument Error: Please give a look to the usage instructions')
  }
  console.log(argsHelp())
  process.exit(error ? 1 : 0)
}

const run = async args => {
  if (!args._) {
    printhelp(true)
  }

  switch (args._[0]) {
    case 'create':
      return createCli(args)
    case 'migrate':
      return migrateCli(args)
    default:
      printhelp(!args['--help'])
  }
}

const args = arg(
  Object.assign(
    {},
    {
      '--help': Boolean,
      '-h': '--help',
      '--verbose': Boolean,
      '-v': '--verbose'
    },
    createOptions,
    migrateOptions
  )
)
run(args)
  .then((message = 'done!') => {
    console.log(message)
  })
  .catch(e => {
    console.error(args['--verbose'] ? e : e.message)

    process.exit(1)
  })
