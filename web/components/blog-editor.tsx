import { Button, Flex, Stack } from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import SubScript from "@tiptap/extension-subscript";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";
import CodeBlock from "@tiptap/extension-code-block";
import { useUpdateBlogMutation } from "../api/blog";
import { notifications } from "@mantine/notifications";
// import { notifications } from "@mantine/notifications";

function BlogEditor({ blogId, content }: { blogId: string; content: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      SubScript,
      Highlight,
      Image,
      CodeBlock.configure({
        defaultLanguage: "plaintext",
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
  });

  const [updateContent] = useUpdateBlogMutation();

  useEffect(() => {
    editor?.commands.setContent(content);
  }, [content, editor]);

  return (
    <Stack>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>

      <Flex justify={"end"}>
        <Button
          aria-label="Save Content"
          onClick={() => {
            updateContent({ blog_id: blogId, content: editor?.getHTML() }).then(
              () =>
                notifications.show({ message: "Blog edited!", color: "green" })
            );
          }}
        >
          Save Content
        </Button>
      </Flex>
    </Stack>
  );
}

export default BlogEditor;
