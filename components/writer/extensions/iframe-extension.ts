import { Node, mergeAttributes } from '@tiptap/core'

export interface IframeOptions {
    allowFullscreen: boolean,
    HTMLAttributes: {
        [key: string]: any
    },
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        iframe: {
            setIframe: (options: { src: string }) => ReturnType,
        }
    }
}

export const IframeExtension = Node.create<IframeOptions>({
    name: 'iframe',

    group: 'block',

    atom: true,

    addOptions() {
        return {
            allowFullscreen: true,
            HTMLAttributes: {
                class: 'w-full h-[500px] border-none rounded-lg',
            },
        }
    },

    addAttributes() {
        return {
            src: {
                default: null,
            },
            frameborder: {
                default: 0,
            },
            allowfullscreen: {
                default: this.options.allowFullscreen,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'iframe',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', { class: 'iframe-wrapper my-8' }, ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]]
    },

    addCommands() {
        return {
            setIframe: (options: { src: string }) => ({ tr, dispatch }) => {
                const { selection } = tr
                const node = this.type.create(options)

                if (dispatch) {
                    tr.replaceRangeWith(selection.from, selection.to, node)
                }

                return true
            },
        }
    },

    addStorage() {
        return {
            markdown: {
                serialize(state: any, node: any) {
                    state.write(`\n<iframe src="${node.attrs.src}" class="w-full h-[500px]" allowfullscreen></iframe>\n`)
                }
            }
        }
    }
})
