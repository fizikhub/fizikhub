import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { InlineMath } from 'react-katex'
import { InputRule, PasteRule } from '@tiptap/core'

export const MathExtension = Node.create({
    name: 'math',

    group: 'inline',

    inline: true,

    selectable: true,

    atom: true,

    addAttributes() {
        return {
            latex: {
                default: 'E = mc^2',
                parseHTML: element => element.getAttribute('data-latex'),
                renderHTML: attributes => {
                    return {
                        'data-latex': attributes.latex,
                    }
                },
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="math"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'math' })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(({ node, selected }) => { // removed updateAttributes
            return (
                <NodeViewWrapper className="inline-block relative cursor-pointer mx-1 select-none">
                    <span
                        className={`inline-block px-1 rounded transition-colors ${selected ? 'bg-primary/20 ring-2 ring-primary/50' : 'hover:bg-muted'}`}
                        title="Düzenlemek için tıklayın"
                    >
                        <InlineMath math={node.attrs.latex} />
                    </span>
                    {/* Minimal input for fallback usually needed, but here we might prefer a dialog or popover. 
                For now, let's keep it simple: if selected, we could show a popover in the main editor UI 
                or just rely on the bubble menu if we had one. 
                Since we don't have a bubble menu easily ready for this specific node in the current setup, 
                let's assume we will edit it via a Dialog triggered from the toolbar or double click.
             */}
                </NodeViewWrapper>
            )
        })
    },

    addInputRules() {
        return [
            new InputRule({
                find: /\$(.+)\$/,
                handler: ({ state, range, match }) => {
                    const { tr } = state
                    const start = range.from
                    const end = range.to
                    const latex = match[1]

                    tr.replaceWith(start, end, this.type.create({ latex }))
                },
            }),
        ]
    },

    addPasteRules() {
        return [
            new PasteRule({
                find: /\$\$([^\$]+)\$\$/g, // Block math syntax (double dollar)
                handler: ({ state, range, match }) => {
                    const { tr } = state
                    const latex = match[1].trim()
                    tr.replaceWith(range.from, range.to, this.type.create({ latex }))
                },
            }),
            new PasteRule({
                find: /\$([^\$]+)\$/g, // Inline math syntax (single dollar)
                handler: ({ state, range, match }) => {
                    const { tr } = state
                    const latex = match[1].trim()
                    tr.replaceWith(range.from, range.to, this.type.create({ latex }))
                },
            }),
        ]
    },

    // Custom storage or helpers can be added here
    addStorage() {
        return {
            markdown: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                serialize(state: any, node: any) {
                    state.write(`$${node.attrs.latex}$`)
                },
                parse: {
                    // This setup needs to be compatible with tiptap-markdown 
                    // which usually requires configuring the extension in the editor setup, not here.
                    // We will handle the markdown config in the editor setup.
                }
            }
        }
    }
})
