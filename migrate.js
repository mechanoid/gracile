import path from 'path'
import fs from 'fs-extra'

export default async (options = { dir: './migrations' }) => {
  const dir = path.resolve(process.cwd(), options.dir)
  await fs.ensureDir(dir)

  const fileNames = await fs.readdir(dir)
  const filePaths = fileNames.map(n => path.join(dir, n))
  const migrations = await Promise.all(filePaths.map(f => import(f)))

  migrations.forEach(m => m.up())
}
