import create from '../create.js'

const defaultDir = './migrations'

const argOptions = {
  '--dir': String,
  '--help': Boolean
}
const aliases = {
  // aliases
  '-d': '--dir',
  '-h': '--help'
}

const argDescriptions = {
  '--dir': `select directory in which the migration should be created (default: "${defaultDir}")`,
  '--help': 'shows help message'
}

const alias = name => {
  const entry = Object.entries(aliases).find(
    ([alias, option]) => option === name
  )
  return entry ? entry[0] : null
}

export const description = `creates a new migration file in the migration directory (default: ${defaultDir})`

const argsHelp = () => {
  const options = Object.entries(argOptions).map(([name, type]) => ({
    name,
    type,
    alias: alias(name),
    description: argDescriptions[name]
  }))

  return `
gracile create MIGRATION_NAME [options]

${description}

allowed options:

${options
  .map(
    o =>
      `  ${o.name}${o.alias ? ` / ${o.alias}` : ''} (${o.type &&
        o.type.name}): ${o.description}`
  )
  .join('\n')}
`
}

export const createOptions = Object.assign({}, argOptions, aliases)

export const createCli = async args => {
  if (args['--help']) {
    console.log(argsHelp())
    process.exit(0)
  }

  const migrationName = args._ && args._.length > 1 && args._[1]

  if (!migrationName) {
    throw new Error(
      'MIGRATION_NAME is missing. Please go for `gracile create --help` for usage instructions'
    )
  }

  const options = {
    dir: args['--dir'] || defaultDir
  }

  return create(migrationName, options)
}
