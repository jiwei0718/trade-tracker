import { createContext, useContext, useMemo, useRef, type ReactNode } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { router } from 'expo-router';

import { linkHref, splitTerms } from '@/lib/term-links';

/**
 * 專有名詞的寫法:同一頁第一次出現時「中文 (原文)」,之後只寫中文。
 * Each page wraps its content in <TermScope>; every <TermText> inside shares one record
 * of which words already appeared with their original.
 */
interface ScopeValue { seen: Set<string>; self?: string }
const Scope = createContext<ScopeValue | null>(null);

/**
 * self: the page's own subject (e.g. "term:mfn" on the MFN page), shown as plain text —
 * the page title already gives its original.
 */
export function TermScope({ children, resetKey, self }: { children: ReactNode; resetKey?: string; self?: string }) {
  // A new page (e.g. another agreement) starts a new record.
  const value = useMemo(() => ({ seen: new Set<string>(), self }), [resetKey, self]);
  return <Scope.Provider value={value}>{children}</Scope.Provider>;
}

interface Props {
  children: string | null | undefined;
  style?: StyleProp<TextStyle>;
  linkStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

/** When the text itself is the abbreviation (「WTO」), the parentheses give only the full name. */
function originalFor(word: string, original: string) {
  const tail = `, ${word}`;
  return original.endsWith(tail) ? original.slice(0, -tail.length) : original;
}

/** Text whose glossary terms, organisations and agreement abbreviations are links. */
export default function TermText({ children, style, linkStyle, numberOfLines }: Props) {
  const scope = useContext(Scope);
  const seen = scope?.seen ?? null;
  const text = children ?? '';
  const segments = useMemo(() => splitTerms(text), [text]);

  // Decide once per text which links carry the original, so re-renders do not flip them.
  const decided = useRef<{ text: string; scope: Set<string> | null; first: boolean[] } | null>(null);
  if (!decided.current || decided.current.text !== text || decided.current.scope !== seen) {
    const first = segments.map(s => {
      if (s.type !== 'link' || !s.target.original) return false;
      const key = `${s.target.kind}:${s.target.id}`;
      if (seen?.has(key)) return false;
      seen?.add(key);
      return true;
    });
    decided.current = { text, scope: seen, first };
  }
  const first = decided.current.first;

  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {segments.map((s, i) =>
        s.type === 'text' || `${s.target.kind}:${s.target.id}` === scope?.self ? s.text : (
          <Text
            key={i}
            onPress={() => router.push(linkHref(s.target) as never)}
            style={[{ color: '#2563eb', textDecorationLine: 'underline', textDecorationStyle: 'dotted' }, linkStyle]}>
            {s.text}{first[i] ? ` (${originalFor(s.text, s.target.original!)})` : ''}
          </Text>
        ))}
    </Text>
  );
}
