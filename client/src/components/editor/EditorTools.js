import Embed from "@editorjs/embed"
import List from "@editorjs/list"
import Image from "@editorjs/image"
import Header from "@editorjs/header"
import Quote from "@editorjs/quote"
import Marker from "@editorjs/marker"
import InlineCode from "@editorjs/inline-code"
import LinkTool from '@editorjs/link';
import Table from "editorjs-table"
import YoutubeEmber from 'editorjs-youtube-embed'

// functions
import { uploadImage } from "../../functions/aws"
import { getSession } from "../../functions/session"

const uploadImageByUrl = (img) => {
    const link = new Promise((resolve, reject) => {
        try {
            resolve(img)
        } catch (error) {
            reject(error)
        }
    })

    return link.then((url) => {
        return {
            success: 1,
            file: { url },
        }
    })
}

const uploadImageByFile = (img) => {
    const { access_token } = JSON.parse(getSession("user"))

    return uploadImage(img, access_token).then((url) => {
        if (url) {
            return {
                success: 1,
                file: { url },
            }
        }
    })
}

export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true,
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByUrl,
                uploadByFile: uploadImageByFile,
            },
        },
    },
    header: {
        class: Header,
        config: {
            placeholder: "Type heading...",
            levels: [2, 3],
            defaultLevel: 2,
        },
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
    },
    marker: Marker,
    inlineCode: InlineCode,
    linkTool: {
        class: LinkTool,
        config: {
            endpoint: '',
        }
    },
    table: {
        class: Table,
        inlineToolbar: true,
        config: {
            rows: 2,
            cols: 3,
            withHeadings: true,
        },
    },
    youtubeEmbed: {
        class: YoutubeEmber,
        inlineToolbar: true,
        config: {
            service: 'youtube',
            embedUrl: 'https://www.youtube.com/embed/',
            placeholder: 'https://www.youtube.com/watch?v=VIDEO_ID',
        },
    },
}
