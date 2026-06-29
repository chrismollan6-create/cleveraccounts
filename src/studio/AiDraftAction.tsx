import { useCallback, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Box,
  Button,
  Card,
  Flex,
  Spinner,
  Stack,
  Text,
  TextArea,
} from "@sanity/ui";
import {
  useDocumentOperation,
  type DocumentActionDescription,
  type DocumentActionProps,
} from "sanity";

type DocLike = Record<string, unknown> | null;

function readString(doc: DocLike, key: string): string {
  if (!doc) return "";
  const value = doc[key];
  return typeof value === "string" ? value : "";
}

export function AiDraftAction(
  props: DocumentActionProps
): DocumentActionDescription {
  const { id, type, draft, published, onComplete } = props;
  const doc = (draft ?? published) as DocLike;

  const { patch } = useDocumentOperation(id, type);

  const [open, setOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Best-effort "what is this document about" context for the prompt.
  const promptContext = useMemo(() => {
    return (
      readString(doc, "title") ||
      readString(doc, "clientName") ||
      readString(doc, "name") ||
      readString(doc, "heading") ||
      ""
    );
  }, [doc]);

  const hasDescriptionField = doc ? "description" in doc : false;

  const reset = useCallback(() => {
    setOpen(false);
    setInstruction("");
    setLoading(false);
    setResult("");
    setError("");
    setCopied(false);
  }, []);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError("");
    setResult("");
    setCopied(false);
    try {
      const res = await fetch("/api/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptContext,
          instruction: instruction.trim(),
        }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || !data.text) {
        setError(data.error || "Failed to generate copy.");
      } else {
        setResult(data.text);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  }, [instruction, promptContext]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
    } catch {
      // Clipboard may be blocked; the text is on-screen to copy manually.
      setCopied(false);
    }
  }, [result]);

  const handleInsert = useCallback(() => {
    if (!result) return;
    patch.execute([{ set: { description: result } }]);
    reset();
    onComplete();
  }, [result, patch, reset, onComplete]);

  return {
    label: "✨ AI draft",
    icon: Sparkles,
    onHandle: () => setOpen(true),
    dialog: open && {
      type: "dialog",
      header: "AI draft",
      onClose: () => {
        reset();
        onComplete();
      },
      content: (
        <Stack space={4}>
          <Stack space={2}>
            <Text size={1} weight="semibold">
              What copy do you want?
            </Text>
            <TextArea
              rows={3}
              placeholder='e.g. "a hero subheadline for a sole trader page"'
              value={instruction}
              onChange={(e) =>
                setInstruction((e.target as HTMLTextAreaElement).value)
              }
            />
            {promptContext ? (
              <Text size={1} muted>
                Context from this document: “{promptContext}”
              </Text>
            ) : null}
          </Stack>

          <Flex gap={2}>
            <Button
              text="Generate"
              tone="primary"
              icon={Sparkles}
              disabled={loading || instruction.trim().length === 0}
              onClick={handleGenerate}
            />
            {loading ? (
              <Flex align="center" gap={2}>
                <Spinner muted />
                <Text size={1} muted>
                  Drafting…
                </Text>
              </Flex>
            ) : null}
          </Flex>

          {error ? (
            <Card padding={3} radius={2} tone="critical">
              <Text size={1}>{error}</Text>
            </Card>
          ) : null}

          {result ? (
            <Stack space={3}>
              <Card padding={3} radius={2} tone="transparent" border>
                <Text size={1} style={{ whiteSpace: "pre-wrap" }}>
                  {result}
                </Text>
              </Card>
              <Flex gap={2}>
                <Button
                  text={copied ? "Copied!" : "Copy"}
                  tone={copied ? "positive" : "default"}
                  mode="ghost"
                  onClick={handleCopy}
                />
                {hasDescriptionField ? (
                  <Button
                    text="Insert into Description"
                    tone="primary"
                    onClick={handleInsert}
                  />
                ) : null}
              </Flex>
              {!hasDescriptionField ? (
                <Box>
                  <Text size={1} muted>
                    This document has no “description” field — use Copy and paste
                    where you need it.
                  </Text>
                </Box>
              ) : null}
            </Stack>
          ) : null}
        </Stack>
      ),
    },
  };
}
