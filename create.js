import path from 'path'
import fs from 'fs-extra'

const migrationFileName = migrationName => `${Date.now()}-${migrationName}.js`

export default async (migrationName, options = { dir: './fsd' }) => {
  const dir = path.resolve(process.cwd(), options.dir)
  const fileName = migrationFileName(migrationName)
  const filePath = path.resolve(dir, fileName)
  const exists = await fs.pathExists(filePath)

  await fs.ensureDir(dir)

  if (exists) {
    // should not ever happen, due to the timestamp, but who knows
    throw new Error('migration file already exists')
  }

  await fs.outputFile(filePath, 'Hello World')
  return `${filePath} has been successfully created`
}
