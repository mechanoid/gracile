import migrate from '../migrate.js'

const defaultDir = './migrations'

const argOptions = {
  '--dir': String,
  '--help': Boolean,
  '--operator': String,
  '--host': String,
  '--port': String,
  '--username': String,
  '--password': String
}
const aliases = {
  // aliases
  '-d': '--dir',
  '-h': '--help',
  '-o': '--operator',
  '-t': '--host',
  '-p': '--port',
  '-u': '--username',
  '-w': '--password'
}

const argDescriptions = {
  '--dir': `select migration directory (default: "${defaultDir}")`,
  '--operator': 'connect database operator (e.g. gracile-postgres)',
  '--host': 'database host',
  '--port': 'database port',
  '--username': 'database username',
  '--password': 'database password',
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
    dir: args['--dir'] || defaultDir,
    operator: args['--operator'],
    host: args['--host'],
    port: args['--port'],
    username: args['--username'],
    password: args['--password']
  }

  return migrate(options)
}
