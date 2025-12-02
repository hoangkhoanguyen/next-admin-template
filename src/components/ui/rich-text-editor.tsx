"use client";

import * as React from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Palette,
} from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";
import { Input } from "./input";
import { Label } from "./label";
import { Separator } from "./separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { useImagePickerDialog } from "../shared/ImagePickerDialogContext";

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  minHeight?: string;
  maxHeight?: string;
  disabled?: boolean;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  tooltip: string;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  children,
  tooltip,
}: ToolbarButtonProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className="h-8 w-8 p-0"
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface ColorPickerProps {
  editor: Editor;
}

function ColorPicker({ editor }: ColorPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const colors = [
    "#000000",
    "#ffffff",
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#84cc16",
    "#10b981",
    "#06b6d4",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#d946ef",
    "#ec4899",
  ];

  return (
    <div className="relative">
      <ToolbarButton
        onClick={() => setIsOpen(!isOpen)}
        tooltip="Màu chữ"
        isActive={isOpen}
      >
        <Palette className="h-4 w-4" />
      </ToolbarButton>
      {isOpen && (
        <div className="absolute top-full mt-1 z-50 bg-popover border rounded-md shadow-lg p-2">
          <div className="grid grid-cols-7 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                className="w-6 h-6 rounded border-2 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => {
                  editor.chain().focus().setColor(color).run();
                  setIsOpen(false);
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
}

function ImageDialog({ isOpen, onClose, onInsert }: ImageDialogProps) {
  const [url, setUrl] = React.useState("");
  const { openModal } = useImagePickerDialog();

  const handleUrlInsert = () => {
    if (url) {
      onInsert(url);
      setUrl("");
      onClose();
    }
  };

  const handleOpenGallery = () => {
    openModal({
      onSelect: (selected) => {
        // selected can be array or object
        const imageObj = Array.isArray(selected) ? selected[0] : selected;
        if (imageObj && imageObj.url) {
          onInsert(imageObj.url);
          onClose();
        }
      },
      multiple: false,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm ảnh</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">Paste URL ảnh</Label>
            <Input
              id="image-url"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && url) {
                  handleUrlInsert();
                }
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">hoặc</span>
            <Separator className="flex-1" />
          </div>
          <div className="space-y-2">
            <Label>Chọn từ thư viện hoặc Upload</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleOpenGallery}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Mở thư viện ảnh
            </Button>
            <p className="text-xs text-muted-foreground">
              Có thể chọn ảnh có sẵn hoặc upload ảnh mới
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="button" onClick={handleUrlInsert} disabled={!url}>
            Thêm từ URL
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface LinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
  initialUrl?: string;
}

function LinkDialog({
  isOpen,
  onClose,
  onInsert,
  initialUrl,
}: LinkDialogProps) {
  const [url, setUrl] = React.useState(initialUrl || "");

  React.useEffect(() => {
    setUrl(initialUrl || "");
  }, [initialUrl]);

  const handleInsert = () => {
    if (url) {
      onInsert(url);
      setUrl("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm liên kết</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleInsert();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="button" onClick={handleInsert} disabled={!url}>
            {initialUrl ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Nhập nội dung...",
  className,
  editorClassName,
  minHeight = "200px",
  maxHeight = "500px",
  disabled = false,
}: RichTextEditorProps) {
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = React.useState(false);
  // State for image editing
  const [selectedImageNode, setSelectedImageNode] = React.useState<{
    node: any;
    pos: number;
  } | null>(null);
  const [caption, setCaption] = React.useState("");
  const [showImageToolbar, setShowImageToolbar] = React.useState(false);
  const [resize, setResize] = React.useState<{ width: string; height: string }>(
    { width: "", height: "" }
  );
  const imageToolbarRef = React.useRef<HTMLDivElement>(null);

  const CustomImage = Image.extend({
    renderHTML({ HTMLAttributes }) {
      const { src, alt, width, height } = HTMLAttributes;
      if (alt) {
        return [
          "figure",
          { class: "tiptap-image-figure" },
          [
            "img",
            {
              src,
              alt,
              width,
              height,
              class: "max-w-full h-auto rounded-lg",
            },
          ],
          ["figcaption", { class: "tiptap-image-caption" }, alt],
        ];
      }
      return [
        "img",
        {
          src,
          alt,
          width,
          height,
          class: "max-w-full h-auto rounded-lg",
        },
      ];
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      CustomImage,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none",
          editorClassName
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editable: !disabled,
    immediatelyRender: false,
  });

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Listen for image click events
  React.useEffect(() => {
    if (!editor) return;
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Nếu click vào toolbar thì không tắt
      if (imageToolbarRef.current && imageToolbarRef.current.contains(target)) {
        return;
      }
      if (target.tagName === "IMG" && target.closest(".ProseMirror")) {
        const pos = editor.view.posAtDOM(target, 0);
        const node = editor.view.state.doc.nodeAt(pos);
        if (node?.type.name === "image") {
          setSelectedImageNode({ node, pos });
          setCaption(node.attrs.alt || "");
          setResize({
            width: node.attrs.width || "",
            height: node.attrs.height || "",
          });
          setShowImageToolbar(true);
        }
      } else {
        setShowImageToolbar(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [editor]);

  if (!editor) {
    return null;
  }

  const addImage = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = (url: string) => {
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
  };

  return (
    <div
      className={cn("border rounded-lg overflow-hidden relative", className)}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
        {/* Text formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          disabled={disabled}
          tooltip="In đậm (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          disabled={disabled}
          tooltip="In nghiêng (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          disabled={disabled}
          tooltip="Gạch chân (Ctrl+U)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          disabled={disabled}
          tooltip="Gạch ngang"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          disabled={disabled}
          tooltip="Highlight"
        >
          <Highlighter className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          disabled={disabled}
          tooltip="Code"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <ColorPicker editor={editor} />

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          disabled={disabled}
          tooltip="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          disabled={disabled}
          tooltip="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          disabled={disabled}
          tooltip="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          disabled={disabled}
          tooltip="Danh sách"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          disabled={disabled}
          tooltip="Danh sách số"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          disabled={disabled}
          tooltip="Trích dẫn"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          disabled={disabled}
          tooltip="Căn trái"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          disabled={disabled}
          tooltip="Căn giữa"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          disabled={disabled}
          tooltip="Căn phải"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          disabled={disabled}
          tooltip="Căn đều"
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Insert */}
        <ToolbarButton
          onClick={() => setLinkDialogOpen(true)}
          isActive={editor.isActive("link")}
          disabled={disabled}
          tooltip="Thêm liên kết"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => setImageDialogOpen(true)}
          disabled={disabled}
          tooltip="Thêm ảnh"
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo() || disabled}
          tooltip="Hoàn tác (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo() || disabled}
          tooltip="Làm lại (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div
        className="overflow-y-auto px-4 py-3"
        style={{ minHeight, maxHeight }}
      >
        <EditorContent editor={editor} placeholder={placeholder} />
        {/* Image editing toolbar */}
        {showImageToolbar && selectedImageNode && (
          <div
            ref={imageToolbarRef}
            className="absolute left-1/2 top-8 z-50 bg-popover border rounded-lg shadow-lg p-4 min-w-[320px] -translate-x-1/2"
          >
            <div className="font-semibold mb-2">Chỉnh sửa ảnh</div>
            <div className="space-y-2">
              <div>
                <Label htmlFor="image-caption" className="text-sm font-medium">
                  Caption
                </Label>
                <Input
                  id="image-caption"
                  type="text"
                  className="text-sm mt-1"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Thêm chú thích cho ảnh"
                />
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .command(({ tr }) => {
                        tr.setNodeMarkup(selectedImageNode.pos, undefined, {
                          ...selectedImageNode.node.attrs,
                          alt: caption,
                        });
                        return true;
                      })
                      .run();
                    setShowImageToolbar(false);
                  }}
                >
                  Lưu caption
                </Button>
              </div>
              <div className="flex gap-2">
                <div>
                  <Label htmlFor="image-width" className="text-sm font-medium">
                    Width
                  </Label>
                  <Input
                    id="image-width"
                    type="number"
                    className="w-20 text-sm mt-1"
                    value={resize.width}
                    onChange={(e) =>
                      setResize((r) => ({ ...r, width: e.target.value }))
                    }
                    placeholder="auto"
                  />
                </div>
                <div>
                  <Label htmlFor="image-height" className="text-sm font-medium">
                    Height
                  </Label>
                  <Input
                    id="image-height"
                    type="number"
                    className="w-20 text-sm mt-1"
                    value={resize.height}
                    onChange={(e) =>
                      setResize((r) => ({ ...r, height: e.target.value }))
                    }
                    placeholder="auto"
                  />
                </div>
                <Button
                  size="sm"
                  className="mt-6"
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .command(({ tr }) => {
                        tr.setNodeMarkup(selectedImageNode.pos, undefined, {
                          ...selectedImageNode.node.attrs,
                          width: resize.width,
                          height: resize.height,
                        });
                        return true;
                      })
                      .run();
                    setShowImageToolbar(false);
                  }}
                >
                  Lưu kích thước
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // Replace image
                    setShowImageToolbar(false);
                    setTimeout(() => {
                      // Open image dialog again
                      setImageDialogOpen(true);
                    }, 100);
                  }}
                >
                  Đổi ảnh
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    editor.chain().focus().deleteNode("image").run();
                    setShowImageToolbar(false);
                  }}
                >
                  Xóa ảnh
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ImageDialog
        isOpen={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onInsert={addImage}
      />

      <LinkDialog
        isOpen={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        onInsert={setLink}
        initialUrl={editor.getAttributes("link").href}
      />
    </div>
  );
}
