export interface FileTreeNode {
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileTreeNode[]
}

/**
 * Parse an indentation-based file tree string into a tree structure.
 * Trailing `/` forces a node to be a folder (even if empty).
 *
 * Example input:
 *   src
 *     schema.ts
 *     components/
 *       ChatApp.vue
 *   package.json
 */
export function parseFileTree(input: string): FileTreeNode[] {
  const lines = input
    .replace(/\r\n?/g, '\n')
    .replace(/\t/g, '  ')
    .split('\n')
    .map(l => l.replace(/\t/g, '  '))

  const root: FileTreeNode[] = []
  const stack: Array<{ indent: number; node: FileTreeNode }> = []
  let prevIndent = 0
  let prevNode: FileTreeNode | null = null

  const getIndent = (line: string) => {
    let i = 0
    while (i < line.length && line[i] === ' ') i++
    return i
  }

  for (const raw of lines) {
    if (!raw.trim()) continue
    const indent = getIndent(raw)
    let trimmed = raw.trim()

    let forcedFolder = false
    if (trimmed.endsWith('/')) {
      forcedFolder = true
      trimmed = trimmed.slice(0, -1)
    }

    if (prevNode && indent > prevIndent) {
      if (prevNode.type === 'file') {
        prevNode.type = 'folder'
        prevNode.children = []
      }
      stack.push({ indent: prevIndent, node: prevNode })
    } else {
      while (stack.length && indent <= stack[stack.length - 1].indent) {
        stack.pop()
      }
    }

    const parent = stack.length ? stack[stack.length - 1].node : null
    const node: FileTreeNode = {
      name: trimmed,
      type: forcedFolder ? 'folder' : 'file',
      path: parent ? `${parent.path}/${trimmed}` : `/${trimmed}`,
      children: forcedFolder ? [] : undefined,
    }

    if (parent) {
      parent.children = parent.children ?? []
      parent.children.push(node)
    } else {
      root.push(node)
    }

    prevIndent = indent
    prevNode = node
  }

  return root
}

/**
 * Build a file tree from an array of flat file paths.
 * e.g. ['src/App.vue', 'src/main.ts', 'package.json']
 */
export function buildTreeFromPaths(paths: string[]): FileTreeNode[] {
  const root: FileTreeNode[] = []

  for (const rawPath of paths) {
    const path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`
    const parts = path.split('/').filter(Boolean)

    let currentChildren = root
    let currentPath = ''

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      currentPath += `/${part}`
      const isLast = i === parts.length - 1

      const existing = currentChildren.find(n => n.name === part)
      if (existing) {
        if (!isLast) {
          // Navigate into existing folder
          if (existing.type === 'file') {
            existing.type = 'folder'
            existing.children = []
          }
          currentChildren = existing.children!
        }
      } else {
        const node: FileTreeNode = {
          name: part,
          type: isLast ? 'file' : 'folder',
          path: currentPath,
          children: isLast ? undefined : [],
        }
        currentChildren.push(node)
        if (!isLast) {
          currentChildren = node.children!
        }
      }
    }
  }

  return root
}

/**
 * Collect all folder paths from a tree (for auto-expansion).
 */
export function collectFolderPaths(nodes: FileTreeNode[]): string[] {
  const paths: string[] = []
  function walk(list: FileTreeNode[]) {
    for (const node of list) {
      if (node.type === 'folder') {
        paths.push(node.path)
        if (node.children) walk(node.children)
      }
    }
  }
  walk(nodes)
  return paths
}

/**
 * Find the full path of a file by its basename within the tree.
 * Returns the first match.
 */
export function findFilePath(nodes: FileTreeNode[], basename: string): string | undefined {
  for (const node of nodes) {
    if (node.type === 'file' && node.name === basename) return node.path
    if (node.children) {
      const found = findFilePath(node.children, basename)
      if (found) return found
    }
  }
  return undefined
}

/**
 * Get ancestor folder paths for a given file path.
 * e.g. '/src/components/ChatApp.vue' → ['/src', '/src/components']
 */
export function getAncestorPaths(filePath: string): string[] {
  const parts = filePath.split('/').filter(Boolean)
  const ancestors: string[] = []
  let current = ''
  for (let i = 0; i < parts.length - 1; i++) {
    current += `/${parts[i]}`
    ancestors.push(current)
  }
  return ancestors
}

const FILE_NAME_ICONS: Record<string, string> = {
  'package.json': 'i-vscode-icons:file-type-node',
  'tsconfig.json': 'i-vscode-icons:file-type-tsconfig',
  'vite.config.ts': 'i-vscode-icons:file-type-vite',
  '.gitignore': 'i-vscode-icons:file-type-git',
}

const EXTENSION_ICONS: Record<string, string> = {
  vue: 'i-logos:vue',
  ts: 'i-logos:typescript-icon',
  tsx: 'i-logos:typescript-icon',
  js: 'i-logos:javascript',
  jsx: 'i-logos:javascript',
  json: 'i-carbon:settings',
  css: 'i-logos:css-3',
  scss: 'i-logos:sass',
  sass: 'i-logos:sass',
  html: 'i-logos:html-5',
  md: 'i-carbon:document',
  svg: 'i-carbon:image',
  png: 'i-carbon:image',
  jpg: 'i-carbon:image',
  jpeg: 'i-carbon:image',
  gif: 'i-carbon:image',
  ico: 'i-vscode-icons:file-type-favicon',
}

/** Resolve an icon class for a filename. Checks exact name first, then extension. */
export function getFileIcon(filename: string): string {
  if (FILE_NAME_ICONS[filename]) return FILE_NAME_ICONS[filename]
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  return EXTENSION_ICONS[ext] ?? 'i-carbon:document'
}
