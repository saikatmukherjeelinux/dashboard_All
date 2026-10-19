"""Shared reference for 30 regex recipes. Python re syntax applies.

Browser lessons use JavaScript regex syntax. The supplied ASCII examples agree;
arbitrary patterns, Unicode classes, and case folding may differ between engines.
This Python helper does not impose a worker timeout: only run trusted patterns.
"""
import re


def regex_recipe(text, pattern, mode='matches', flags='', replacement=''):
    """Match, validate, split, or replace using explicit code-point spans.

    Replacement syntax is $1 through $9 and $$, matching the teaching UI.
    Split keeps empty pieces without inserting captured separators. Empty
    matches advance one code point; nonempty matches are non-overlapping.
    """
    if mode not in {'matches', 'validate', 'split', 'replace'}:
        raise ValueError('Unknown regex operation')
    if any(flag not in 'ims' for flag in flags) or len(set(flags)) != len(flags):
        raise ValueError('Flags may contain i, m, and s once each')
    options = 0
    for flag in flags:
        options |= {'i': re.IGNORECASE, 'm': re.MULTILINE, 's': re.DOTALL}[flag]
    expression = re.compile(pattern, options)
    if mode == 'validate':
        return expression.fullmatch(text) is not None
    matches, pieces, cursor, position = [], [], 0, 0
    while position <= len(text):
        match = expression.search(text, position)
        if match is None:
            break
        matches.append({'match': match.group(0), 'start': match.start(),
                        'end': match.end(), 'groups': list(match.groups())})
        if mode == 'split':
            pieces.append(text[cursor:match.start()])
            cursor = match.end()
        elif mode == 'replace':
            def expand(token):
                key = token.group(1)
                if key == '$':
                    return '$'
                index = int(key)
                return (match.group(index) or '') if index <= expression.groups else '$' + key
            pieces.extend([text[cursor:match.start()], re.sub(r'\$(\$|[1-9])', expand, replacement)])
            cursor = match.end()
        position = match.end() + (match.start() == match.end())
    if mode in {'split', 'replace'}:
        pieces.append(text[cursor:])
        return pieces if mode == 'split' else ''.join(pieces)
    return matches
