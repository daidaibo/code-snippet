function visitNode(node?: Node) {
  if (node instanceof Comment) {
    // 注释
    console.info('Comment node', node.textContent)
  }
  if (node instanceof Text) {
    // 文本
    const text = node.textContent?.trim()
    if (text) {
      console.info('Text node', text)
    }
  }
  if (node instanceof HTMLElement) {
    // 元素
    console.info('Element node', `<${node.tagName.toLowerCase()}>`)
  }
}

function depthFirstRecursionTraverse(root: Node) {
  visitNode(root)
  const childNodes = root.childNodes
  childNodes.forEach(child => {
    depthFirstRecursionTraverse(child)
  })
}
/* 深度优先 */
function depthFirstIterationTraverse(root: Node) {
  const stack: Node[] = []

  stack.push(root)

  while (stack.length) {
    const currNode = stack.pop()!
    visitNode(currNode)

    const childNodes = currNode.childNodes
    if (childNodes.length) {
      Array.from(childNodes).reverse().forEach(child => stack.push(child))
    }
  }
}

// function breadthFirstRecursionTraverse(root: Element) {
//   if (root) {
//     visitNode(root)
//     breadthFirstRecursionTraverse(root.nextElementSibling!)
//     breadthFirstRecursionTraverse(root.firstElementChild!)
//   }
// }

/* 广度优先 */
function breadthFirstTraverse(root: Node) {
  const queue: Node[] = []

  queue.unshift(root)

  while (queue.length) {
    const currNode = queue.pop()!
    visitNode(currNode)

    const childNodes = currNode.childNodes
    childNodes.forEach(child => queue.unshift(child))
  }
}