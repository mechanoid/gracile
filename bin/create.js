const argOptions = {
  '--help': Boolean
}
const aliases = {
  // aliases
  '-h': '--help'
}

const argDescriptions = {
  '--help': 'shows help message'
}

const alias = name => {
  const entry = Object.entries(aliases).find(
    ([alias, option]) => option === name
  )
  return entry ? entry[0] : null
}

export const description =
  'creates a new migration file in the migration directory (default: ./migrations)'

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

export const create = args => {
  if (args['--help']) {
    console.log(argsHelp())
    process.exit(0)
  }
}
