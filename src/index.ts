import * as React from "react"

export function view<K extends keyof any>(key: K) {
  return function<T extends { [x in K]: T[K] }>(data: T) {
    return data[key]
  }
}

export function set<K extends keyof any>(key: K) {
  return function<T extends { [x in K]: T[K] }>(data: T, value: T[K]): T {
    return ({ ...data, [key]: value })
  }
}

export interface Chain<T> {
  view: () => T
  set: (value: T) => void
}

export function chain<K extends keyof any>(key: K) {
  return function<T extends { [x in K]: T[K] }>(start: Chain<T>): Chain<T[K]> {
    return {
      view: (): T[K] => {
        return start.view()[key]
      },
      set: (value: T[K]): void => {
        start.set({ ...start.view(), [key]: value })
      }
    }
  }
}

export function StateLens<State>(component: React.Component<any, State>) {
  const getState = (): State => component.state
  const setState = (state: State) => component.setState(state)

  const root: Chain<State> = {
    view: getState,
    set: setState
  }

  return root
}
