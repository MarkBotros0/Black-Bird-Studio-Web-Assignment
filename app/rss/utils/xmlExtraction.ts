/**
 * Shared utility functions for extracting data from XML elements
 * Used by both client-side and server-side RSS parsers
 */

/**
 * Removes namespace prefix from XML tag or attribute names
 * Example: "media:content" -> "content"
 * 
 * @param name - XML tag or attribute name potentially with namespace
 * @returns Name without namespace prefix
 */
function removeNamespacePrefix(name: string): string {
  if (!name || typeof name !== 'string') return name;
  const colonIndex = name.indexOf(':');
  return colonIndex > -1 ? name.substring(colonIndex + 1) : name;
}

/**
 * Extracts all attributes from an XML element
 * 
 * @param element - XML element to extract attributes from
 * @returns Record of attribute names to values
 */
function extractAttributes(element: Element): Record<string, string> {
  const attrObj: Record<string, string> = {};
  
  if (!element.attributes || element.attributes.length === 0) {
    return attrObj;
  }

  const attributes = element.attributes;
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    if (attr && attr.name && attr.value !== undefined) {
      const attrName = removeNamespacePrefix(attr.name);
      attrObj[attrName] = String(attr.value);
    }
  }
  
  return attrObj;
}

/**
 * Extracts all child elements from an XML node as key-value pairs
 * Handles both plain text elements and elements with attributes
 * Works with both browser DOM (Element.children) and xmldom (childNodes)
 */
export function extractElementFields(element: Element): Record<string, string> {
  const fields: Record<string, string> = {};
  let children: Element[];
  
  if ('children' in element && element.children) {
    children = Array.from(element.children) as Element[];
  } else if ('childNodes' in element && element.childNodes) {
    children = Array.from(element.childNodes).filter(
      (node) => (node as Node).nodeType === 1 // ELEMENT_NODE
    ) as Element[];
  } else {
    return fields;
  }
  
  children.forEach((child) => {
    if (!child || !child.tagName) return;
    
    const tagName = removeNamespacePrefix(child.tagName);
    if (!tagName) return;
    
    const textContent = (child.textContent || child.textContent || '').trim();
    const attributes = extractAttributes(child);
    
    if (Object.keys(attributes).length > 0) {
      fields[tagName] = JSON.stringify({ text: textContent, attributes });
    } else if (textContent) {
      fields[tagName] = textContent;
    }
  });
  
  return fields;
}

