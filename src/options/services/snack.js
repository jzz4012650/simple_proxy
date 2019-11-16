import { SHOW_SNACK } from '../constants/channels'

export const showSnack = function (msg) {
  const e = new CustomEvent(SHOW_SNACK, { detail: msg })
  window.dispatchEvent(e)
}
