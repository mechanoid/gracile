#!/usr/bin/env node
import arg from 'arg'
import {
  description as createDescription,
  createCli,
  createOptions
} from './create.js'

const argsHelp = () => {
  return `
gracile [create]

(append --help for the single commands, e.g. 'gracile create --help')

create: ${createDescription}
`
}

const run = async args => {
  if (args._ && args._.indexOf('create') >= 0) {
    return createCli(args)
  } else if (args['--help']) {
    console.log(argsHelp())
    process.exit(0)
  }
}

const args = arg(Object.assign({}, createOptions))
run(args)
  .then((message = 'done!') => {
    console.log(message)
  })
  .catch(e => {
    console.error(e.message)
    process.exit(1)
  })
