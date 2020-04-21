import path from 'path'
import fs from 'fs-extra'
import filterKeys from 'object-filter-keys'

const migrationId = filePath => {
  const fileName = path.basename(filePath, '.js')
  const [id] = fileName.split('-') // TODO: check for malformed filenames
  return id
}

export default async (options = { dir: './migrations' }) => {
  const dir = path.resolve(process.cwd(), options.dir)
  await fs.ensureDir(dir)

  const fileNames = await fs.readdir(dir)
  const filePaths = fileNames.map(n => path.join(dir, n))
  const migrations = await Promise.all(
    filePaths.map(f => import(f).then(m => ({ id: migrationId(f), module: m })))
  )

  if (options.operator) {
    const { init, transmit, close } = await import(options.operator)

    if (init) {
      const operatorConfig = filterKeys(
        options,
        'host',
        'port',
        'username',
        'password',
        'connectionString',
        'poolSize'
      )
      await init(operatorConfig)
    }

    for (const m of migrations) {
      await (transmit
        ? transmit(m.id, m.module.migration)
        : m.module.migration())
    }

    if (close) {
      await close()
    }
  } else {
    for (const m of migrations) {
      await m.module.migration()
    }
  }
}
