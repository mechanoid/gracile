import migrate from '../migrate.js'

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
  '--dir': `select migration directory (default: "${defaultDir}")`,
  '--help': 'shows help message'
}

const alias = name => {
  const entry = Object.entries(aliases).find(
    ([alias, option]) => option === name
  )
  return entry ? entry[0] : null
}

export const description = `walks over all migrations in the migration directory (default: ${defaultDir}) and maintains the migration state in the database`

const argsHelp = () => {
  const options = Object.entries(argOptions).map(([name, type]) => ({
    name,
    type,
    alias: alias(name),
    description: argDescriptions[name]
  }))

  return `
gracile migrate [options]

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

export const migrateOptions = Object.assign({}, argOptions, aliases)

export const migrateCli = async args => {
  if (args['--help']) {
    console.log(argsHelp())
    process.exit(0)
  }

  const options = {
    dir: args['--dir'] || defaultDir
  }

  return migrate(options)
}
