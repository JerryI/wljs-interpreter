// @ts-ignore
import { wolframLanguage } from "priceless-mathematica/src/mathematica/mathematica"

import { basicSetup, EditorView } from "codemirror";

import { keymap } from "@codemirror/view";

import { nord } from 'cm6-theme-nord'

import {javascript } from "@codemirror/lang-javascript"

import { bracketMatching } from "@codemirror/language"

import rainbowBrackets from 'rainbowbrackets'

import { elements } from '../../utils/dom'


let editorCustomTheme = EditorView.theme({
  "&.cm-focused": {
    outline: "dotted 1px black",
    background: '#2e3440'
  },
  ".cm-line": {
    padding: 0,
    'padding-left': '2px',
    'align-items': 'center'
  },
  ".cm-activeLine": {
    'background-color': 'transparent'
  }
});

export const cmEditor = new EditorView({
  extensions: [
    basicSetup,
    editorCustomTheme,   
    wolframLanguage, 
    bracketMatching(),
    rainbowBrackets(),
    nord
  ],
  parent: elements.editor
});

export const jsEditor = new EditorView({
  extensions: [
    basicSetup,
    editorCustomTheme,   
    javascript(),
    bracketMatching(),
    rainbowBrackets(),
    nord
  ],
  parent: elements.jseditor
});

