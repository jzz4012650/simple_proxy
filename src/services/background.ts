export type Background = Window & {
  getCurrentTabHosts: () => Promise<string[]>;
}

let blackgroundPagePromise: Promise<Background | undefined> | undefined = undefined;

export async function getBackgroundPage(): Promise<Background | undefined> {
  if (!blackgroundPagePromise) {
    blackgroundPagePromise = chrome.runtime.getBackgroundPage().catch(() => {
      blackgroundPagePromise = undefined;
    });
  }
  return blackgroundPagePromise;
}