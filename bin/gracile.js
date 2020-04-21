#!/usr/bin/env node
import arg from 'arg'
import {
  description as createDescription,
  create,
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
    return create(args)
  } else if (args['--help']) {
    console.log(argsHelp())
    process.exit(0)
  }
}

const args = arg(Object.assign({}, createOptions))
run(args)
  .then(() => {
    console.log('done!')
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
