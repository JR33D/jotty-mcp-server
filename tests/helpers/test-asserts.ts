// helpers/test-asserts.ts
import assert from "node:assert";

/**
 * Safely get the first content item's text from a tool response
 */
export function getFirstContentText(
  response: { content?: Array<{ text: string | undefined }> }
): string {
  if (response.content == null || response.content.length === 0) {
    assert.fail("Response content is empty");
  }
  const first = response.content[0];
  if (first == null || typeof first.text !== "string") {
    assert.fail("First content item text is missing");
  }
  return first.text;
}
